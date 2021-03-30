const functions = require('firebase-functions');
const admin = require('firebase-admin');
const FieldValue = require('firebase-admin').firestore.FieldValue;

var env = functions.config()
var algoliasearch = require('algoliasearch')
var moment = require('moment')
var client = algoliasearch(env.algolia.appid, env.algolia.apikey)
const chrono = require('chrono-node');

const twilio = require('twilio')('your-twilio-stuff-here', env.twilio.authtoken);
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "your-db-url-here"
})
const user_index = client.initIndex('classroom_user')
const ta_index = client.initIndex('teacher_assistants')

const Stripe = require('stripe');
const stripe = Stripe(env.stripe.testkey);



// exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
//   const email = user.email
//   const displayName = user.displayName


// })


exports.indexUser = functions.firestore
.document('users/{userId}')
.onCreate((snap, context) => {
  let data = snap.data()
  let objectID = snap.id

  if (data.email) createCustomer({data, id:objectID})

  return user_index.saveObject({
    objectID,
    ...data
  })
})

exports.indexTA = functions.firestore
.document('teacher_assistants/{taID}')
.onCreate((snap) => {
  const data = snap.data()
  const objectID = snap.id

  return ta_index.saveObject({
    objectID,
    ...data,
  })
})

exports.updateTaIndex = functions.firestore
.document('teacher_assistants/{taID}')
.onUpdate((change, context) => {
  const data = change.after.data()
  const objectID = change.after.id

  return ta_index.partialUpdateObject({
    objectID,
    ...data,
  })
})

exports.updateUser = functions.firestore
  .document('users/{userId}')
  .onUpdate((change, context) => {
    const data = change.after.data()
    const objectID = change.after.id

    return user_index.partialUpdateObject({
      objectID,
      ...data,
  })
})

const createCustomer = async (user, id) => {
  const customer = await stripe.customers.create({
    email: user.email,
  })

  return admin.firestore().collection('users').doc(id)
  .update({customer})
}

exports.createCustomer = functions.firestore
.document('users/{userId}/create_customer/{customer}')
.onCreate((snap, context) => {
  return createCustomer(snap.data(), snap.data().userId)
})

exports.parseSyllabusDates = functions.firestore
.document('syllabi_text/{syllabi}')
.onCreate((snap, context) => {
  //example usage for date parsing
  const results = chrono.parse('I have an appointment tomorrow from 10 to 11 AM');

  // 
})

exports.cardTokenReceived = functions.firestore
.document('users/{userId}/card_tokens/{tokenId}')
.onCreate((snap, context) => {
  let token =  snap.data()
  let userId = context.params.userId

})


exports.chargeReceived = functions.firestore
.document('users/{userId}/purchase_credits/{chargeId}')
.onCreate((snap, context) => {
  const userId = context.params.userId
  let { amount, description, currency, credits } = snap.data()

  return admin.firestore().collection('users')
  .doc(userId).get().then((doc) => doc.data().stripeId)
  .then((stripeId) => {
    const customer = stripeId

    return stripe.charges.create({
      amount,
      currency,
      description,
      customer
    })
  })
})

// working as of 6/25/19
exports.transferTAFunds = functions.firestore
.document('teeacher_assistants/{taId}/transfers/{transferId}')
.onCreate((snap, context) => {
  const coachId = context.params.coachId
  const ref = snap.ref

  return admin.firestore()
  .collection('teacher_assistants').doc(coachId)
  .get().then((doc) => doc.data().connectAccountId)
  .then((connectAccountId) => {

    return stripe.transfers.create({
      amount: 2500,
      currency: "usd",
      destination: connectAccountId,
    })
  })
})

// Works as of 7/5/19 
exports.payoutTA = functions.firestore
.document('coaches/{mentorId}/payouts/{payoutId}')
.onCreate((snap, context) => {
  console.log(snap.data())
  const { docIds, default_method, amount } = snap.data()
  const mentorId = context.params.mentorId
  const ref = snap.ref
  const source_type = default_method === 'card'? 'instant':'standard'

  return admin.firestore().collection('coaches')
  .doc(mentorId).get().then((doc) => {
    return doc.data().connectAccountId
  }).then((connectAccountId) => {
    return stripe.payouts.create({
      currency: 'usd',
      amount: amount,
      method: source_type,
      statement_descriptor: 'VarsityPrep, LLC'
    }, {
      stripe_account: connectAccountId
    })
  }).then((resp) => {
    console.log(resp) 
    return ref.update({
      payout: resp
    })
  }).then(() => {
    // mark sessions as paid
    if (docIds.length < 1) {
      return;
    }

    return _.forEach(docIds, (docId) => {
      admin.firestore().collection('coaches').doc(mentorId)
      .collection('practices').doc(docId)
      .update({
        paid: true,
      })
    })
  }).catch((err) => console.log(err))
})

//when ta receives message from a customer
exports.MessageReceived = functions.firestore
.document('message_threads/{threadId}/messages/{messageID}')
.onCreate(async (snap, context) => {
  //send pn to users
  let threadId = context.params.threadId
  let { author, text, message, type, total, status } = snap.data()

  let thread = await admin.firestore()
  .collection('message_threads').doc(threadId)
  .get()

  let { taRef, customerRef, } = thread.data()

  let ta = await admin.firestore().collection('teacher_assistants').doc(taRef.id).get()
  let customer = await admin.firestore().collection('users').doc(customerRef.id).get()
  
  let taToken = ta.data().fcmToken
  let customerToken = customer.data().fcmToken

  if (type === 'request') return handleRequest({ amount: total, ta: {...ta.data(), id: ta.id}, customer: {...customer.data(), id: customer.id }, fcmToken: taToken, requestText: message})
  if (type === 'request_response') return handleRequestResponse({ amount: total, ta: {...ta.data(), id: ta.id}, customer: {...customer.data(), id: customer.id }, status, requestText: message})

  let pn = {
    notification: {
      title: `${author.name} has sent you a message`,
      body: text,
    },
    data: {
      authorId: author.id
    },
    token: author.customer?taToken:customerToken
  }

  return Promise.all([  
    admin.messaging().send(pn),
    admin.firestore().document(taRef.path)
    .collection('message_threads').doc(customer.id)
    .update({ lastMessage: text, read: author.customer?false:true }),
    admin.firestore().document(customerRef.path)
    .collection('message_threads').doc(ta.id)
    .update({ lastMessage: text, read: author.customer?true:false }),
  ]).then(() => true)
})

const handleRequest = ({ amount, ta, customer, fcmToken, requestText}) => {

  let sendSMS = true

  if (ta.allowsSMS) {
    //twilio sms
    let msg = `${customer.name} has sent you a request`

    sendSMS = twilio.messages
    .create({body: msg, from: '+14152264813', to: ta.phoneNumber})
  }

  let pn = {
    notification: {
      title: `${customer.name} has sent you a request`,
      body: requestText?requestText:'[No message]',
    },
    data: {
    },
    token: fcmToken
  }

  let activity = {
    description: `${customer.name} has sent you a request`,
    text: `A request has been recieved`,
    type: 'request',
    customer,
    ta,
    amount,
    date: admin.firestore.Timestamp.now(),
    request: requestText?requestText:'[No message]',
  }

  let alert = {
    meeting: {
      title: 'Direct Messages'
    },
    meetingId: '',
    item: activity,
    itemId: '',
    type: 'request',
    date: admin.firestore.Timestamp.now(),
    text: `${customer.name} has sent you a request`,
  }

  let taPhone = ta.phoneNumber

  return Promise.all([
    admin.firestore()
    .collection('teacher_assistants').doc(ta.id)
    .collection('activities').add(activity),
    admin.firestore()
    .collection('users').doc(ta.id)
    .collection('subscriptions').add(alert),
    admin.messaging().send(pn),
    sendSMS,
    twilio.messages
    .create({body: 'You have recieved a request!', from: '+14152264813', to: taPhone})
  ]).then(() => true)
}

const handleRequestResponse = ({ status, ta, customer, amount, requestText }) => {


  let pn = {
    notification: {
      title: `${ta.name} has ${status} your request`,
      body: requestText?requestText:'[No message]',
    },
    data: {
    },
    token: customer.fcmToken
  }

  let activity = {
    description: `You ${status} a request from ${customer.name}`,
    text: `A request has been ${status}`,
    type: 'request_response',
    customer,
    ta,
    amount,
    date: admin.firestore.Timestamp.now(),
    request: requestText?requestText:'[No message]',
  }

  let alert = {
    meeting: {
      title: 'Direct Messages'
    },
    meetingId: '',
    item: activity,
    itemId: '',
    type: 'request_response',
    date: admin.firestore.Timestamp.now(),
    text: `${ta.name} has ${status} your request`,
  }

  return Promise.all([
    admin.firestore()
    .collection('teacher_assistants').doc(ta.id)
    .collection('activities').add(activity),
    twilio.messages
    .create({body: `${ta.name} has ${status} your request.`, from: '+14152264813', to: customer.phoneNumber}),
    admin.firestore().collection('users').doc(customer.id)
    .collection('subscriptions').add(alert),
    admin.messaging().send(pn)
  ]).then(() => true)
}

exports.reviewRecieved = functions.firestore
.document('teachers_assistants/{ta}/reviews/{review}')
.onCreate(async(snap, context) => {
  //average ratings
  //send review for review
  let taId = context.params.ta
  let newRating = snap.data().rating
  let taRef = admin.firestore()
  .collection('teachers_assistants').doc(taId)

  let doc = await taRef.get()
  let rating = doc.data().rating
  let ratingNum = doc.data().ratingNum?doc.data().ratingNum:1

  let averageRating = rating + newRating / ratingNum
  averageRating = averageRating.toFixed(1)

  return taRef.update({
    ratingNum: FieldValue.incriment(1),
    rating: averageRating
  })
})


exports.applePaymentIntent = functions.firestore
.document('users/{userId}/apple_pay_token/{token}')
.onCreate(async (snap, context) => {
  let userId = context.params.userId

  const paymentIntent = await stripe.paymentIntents.create({
    amount: snap.data().amount,
    currency: 'usd',
    payment_method_types: ['card'],
  })

  return admin.firestore()
  .collection('users').doc(userId)
  
})


exports.savePaymentMethod = functions.firestore
.document('users/{userId}/update_payment_method/{card}')
.onCreate(async (snap, context) => {
  let token = snap.data().tokenId
  let userId = context.params.userId

  let user = await admin.firestore()
  .collection('users').doc(userId).get()

  let method = await stripe.customers.createSource(
    user.data().customer.id,
    {
      source: token,
    }
  )

  await user.ref.collection('payment_methods').add(method)
  return  user.ref.update({paymentMethod: method})
})


exports.addDocToDiscussion = functions.firestore
.document('meetings/{meetingId}/documents/{docId}')
.onCreate(async (snap, context) => {
  let data = snap.data()
  let meetingId = context.params.meetingId

  let meeting = await admin.firestore()
  .collection('meetings').doc(meetingId).get()

  let alert = {
    meeting: meeting.data(),
    meetingId: meetingId,
    item: data,
    itemId: snap.id,
    type: 'document_added',
    date: admin.firestore.Timestamp.now(),
    text: `${data.author.displayName} has shared a document`,
  }

  try {
    let subAlerts = []

    let subscribers = await admin.firestore()
    .collection('meetings').doc(meetingId)
    .collection('documents_subs').get()

    subscribers.forEach((doc) => {
      let userSubRef = admin.firestore()
      .collection('users').doc(doc.data().id)
      .collection('subscriptions').add(alert)
      subAlerts.push(userSubRef)
    })
  
    let newNotification = {
      author: data.author,
      type: 'document_added',
      name_of_sender: data.sharedBy,
      senderId: data.author.id,
      item: data,
      text: `${data.sharedBy} has shared a document`,
      title: `${data.sharedBy} has shared a document`,
      timeSent: admin.firestore.Timestamp.now(),
      date: admin.firestore.Timestamp.now(),
    }
  
    let commentRef = admin.firestore()
    .collection('meetings').doc(meetingId)
    .collection('public_comments').add(newNotification)
    subAlerts.push(commentRef)
  
    return Promise.all(subAlerts)
    .then(() => {
      return true
    })
    .catch((err) => {
      console.log(err)
    })
  } catch(err) {
    return console.log(err)
  }
})

exports.addAssignmentToDiscussion = functions.firestore
.document('meetings/{meetingId}/assignments/{assignmentId}')
.onCreate(async (snap, context) => {
  try {
    let data = snap.data()
    let meetingId = context.params.meetingId
    let alerts = []
  
    let meeting = await admin.firestore()
    .collection('meetings').doc(meetingId)
    .get()
  
    let alert = {
      meeting: meeting.data(),
      meetingId: meetingId,
      item: data,
      itemId: snap.id,
      type: 'assignment_added',
      date: admin.firestore.Timestamp.now(),
      text: `${data.author.displayName} has shared an assignment`,
    }

    let calendarEvent = {
      author: data.author,
      meeting: meeting.data(),
      timeSent: data.dueDate,
      date: data.dueDate,
      title: data.title,
      description: data.description,
      item: data,
    }
  
    let subscribers = await admin.firestore()
    .collection('meetings').doc(meetingId)
    .collection('assignments_subs').get()
  
    subscribers.forEach((doc) => {
      let userSubRef = admin.firestore()
      .collection('users').doc(doc.data().id)
      .collection('subscriptions').add(alert)

      let userEventRef = admin.firestore()
      .collection('users').doc(doc.data().id)
      .collection('calendar').doc(snap.id).set(calendarEvent)
  
      alerts.push(userSubRef)
      alerts.push(userEventRef)
    })
  
    let newNotification = {
      author: data.author,
      type: 'asignment_added',
      item: data,
      nameOfSender: data.author.displayName,
      senderId: data.author.id,
      text: `${data.author.displayName} has shared an assignment`,
      title: `${data.author.displayName} has shared an assignment`,
      timeSent: admin.firestore.Timestamp.now(),
      date: admin.firestore.Timestamp.now(),
    }

    let worker = {
      options: {
        item: data,
        meeting: meeting.data()
      },
      performAt: data.date,
      status: 'scheduled',
      worker: 'assignmentDue'
    }
  
    let commentRef = admin.firestore()
    .collection('meetings').doc(meetingId)
    .collection('public_comments').add(newNotification)
  
    alerts.push(commentRef)
    alerts.push(admin.firestore().collection('tasks').add(worker))
  
    return Promise.all(alerts)
    .then(() => {
      return true
    }).catch((err) => {
      console.log(err)
    })
  } catch(err) {
    return console.log(err)
  }
})

exports.removedAssignment = functions.firestore
.document('meetings/{meetingId}/assignments/{assignmentId}')
.onDelete(async (snap, context) => {
  let meetingId = context.params.meetingId

  let subscribers = await admin.firestore()
  .collection('meetings').doc(meetingId)
  .collection('assingments_subs').get()

  let tasks = []

  subscribers.forEach((user) => {
    let userEventRef = admin.firestore()
    .collection('users').doc(user.data().id)
    .collection('calendar').doc(snap.id)
    .delete()

    tasks.push(userEventRef)
  })

  return await Promise.all(tasks).then(() => true)
})

exports.addPollsToDiscussion = functions.firestore
.document('meetings/{meetingId}/polls/{pollId}')
.onCreate(async (snap, context) => {
  let poll = snap.data()
  let meetingId = context.params.meetingId

  try {
    let pollSubscribers = await admin.firestore()
    .collection('meetings').doc(meetingId)
    .collection('polls_subs').get()

    let meeting = await admin.firestore()
    .collection('meetings').doc(meetingId).get()


    let alert = {
      meeting: meeting.data(),
      meetingId: meetingId,
      item: poll,
      itemId: snap.id,
      type: 'poll_added',
      date: admin.firestore.Timestamp.now(),
      text: `${poll.author.displayName} has shared a poll`,
    }
  
    let subAlerts = []
    pollSubscribers.forEach((doc) => {
      let userId = doc.data().id
      let alertRef = admin.firestore()
      .collection('users').doc(userId)
      .collection('subscriptions').add(alert)
      

      subAlerts.push(alertRef)
    })
  
    let newNotification = {
      author: poll.author,
      type: 'poll_added',
      item: poll,
      name_of_sender: poll.author.displayName,
      senderId: poll.author.id,
      text: `${poll.author.displayName} has shared a poll`,
      title: `${poll.author.displayName} has shared a poll`,
      timeSent: admin.firestore.Timestamp.now(),
      date: admin.firestore.Timestamp.now(),
    }

    let worker = {
      options: {
        item: poll,
        meeting: poll.meeting
      },
      performAt: poll.date,
      status: 'scheduled',
      worker: 'pollExpirationImminent'
    }

    let perfObj = poll.date.toDate()
    perfObj.setDate(perfObj.getDate() - 1)
    
    let worker2 = Object.assign({}, worker)
    worker2.performAt = admin.firestore.Timestamp.fromDate(perfObj)
    worker2.worker = 'pollExpired'

  
    let commentRef =  admin.firestore()
    .collection('meetings').doc(meetingId)
    .collection('public_comments').add(newNotification)

    subAlerts.push(commentRef)
    subAlerts.push(admin.firestore().collection('tasks').add(worker))
    subAlerts.push(admin.firestore().collection('tasks').add(worker2))

    return Promise.all(subAlerts).then(() => {
      return true
    }).catch((err) => {
      console.log(err)
    })
  } catch(err) {
    return console.log(err)
  }
})

exports.sendDocumentAlert = functions.firestore
.document('meetings/{meetingId}/documents/{docId}/messages/{messageId}')
.onCreate((snap, context) => {
  const { item, meeting, user, event } = snap.data()

  if (!event) {
    return 'start subscribing'
  }

  let message = {
    notification: {
      title: `${author.name} has replied to your comment`,
      body: text,
    },
    data: {
      group: currentPost.id,
      screen: 'myStuff',
      currentPost: JSON.stringify(currentPost),
    },
    token: token,
  }
  let sendPN = admin.messaging().send(message)
  let sendAlert = admin.firestore()
  .collection('users').doc(user.id)

  Promise.all([ sendPN, sendAlert ])
})


exports.sendEventsAlert = functions.firestore
.document('meetings/{meetingId}/events/{eventsId}')
.onCreate( async (snap, context) => {
  try {
    const meetingId = context.params.meetingId
    let data = snap.data()
  
    let meeting = await admin.firestore()
    .collection('meetings').doc(meetingId)
    .get()

    let alert = {
      meeting: meeting.data(),
      meetingId: meetingId,
      item: data,
      itemId: snap.id,
      type: 'event_added',
      date: admin.firestore.Timestamp.now(),
      timeSent: admin.firestore.Timestamp.now(),
      text: `${data.author.displayName} has added an event`,
      title: `${data.author.displayName} has added an event`,
    }

    let calendarEvent = {
      author: data.author,
      meeting: meeting.data(),
      timeSent: admin.firestore.Timestamp.now(),
      date: admin.firestore.Timestamp.now(),
      title: data.title,
      description: data.description,
      item: data,
    }

    let subscribers = await admin.firestore()
    .collection('meetings').doc(meetingId)
    .collection('events_subs').get()

    if (subscribers.empty) return await admin.firestore()
    .collection('meetings').doc(meetingId)
    .collection('public_comments').add(alert)

    let subAlerts = []
    let tokens = []

    await admin.firestore()
    .collection('meetings').doc(meetingId)
    .collection('public_comments').add(alert)

    subscribers.forEach((user) => {
      let userSubRef = admin.firestore()
      .collection('users').doc(user.data().id)
      .collection('subscriptions').add(alert)
      
      let userEventRef = admin.firestore()
      .collection('users').doc(user.data().id)
      .collection('calendar').doc(snap.id)
      .set(calendarEvent)

      subAlerts.push(userSubRef)
      subAlerts.push(userEventRef)
      tokens.push(user.data().fcmToken)
    })
    
    let messages = {
      tokens: tokens,
      notification: {
        title: `${data.author.displayName} has added an event`,
        body: data.title,
      },
      data: {
        group: meetingId,
      },
    }

    let worker = {
      options: {
        item: data,
        meeting: data.meeting
      },
      performAt: data.date,
      status: 'scheduled',
      worker: 'eventStarted'
    }
    // make new worker object
    let worker2 = Object.assign({}, worker)

    //make perform at date the day before and change worker
    let perfObj = data.date.toDate()
    perfObj.setDate(perfObj.getDate()-1)
    worker2.performAt = admin.firestore.Timestamp.fromDate(perfObj)
    worker2.worker = 'eventImminent'
  
    let sendPN = tokens.length?admin.messaging().sendMulticast(messages):true
    
    subAlerts.push(sendPN)
    subAlerts.push(admin.firestore().collection('tasks').add(worker))
    subAlerts.push(admin.firestore().collection('tasks').add(worker2))


    await Promise.all(subAlerts)
    return true
  } catch(err) {
    return console.log(err)
  }
})

exports.removeEventsAlert = functions.firestore
.document('meetings/{meetingId}/events/{eventsId}')
.onDelete(async (snap, context) => {
  let meetingId = context.params.meetingId

  let subscribers = await admin.firestore()
  .collection('meetings').doc(meetingId)
  .collection('events_subs').get()

  let tasks = []

  subscribers.forEach((user) => {
    let userEventRef = admin.firestore()
    .collection('users').doc(user.data().id)
    .collection('calendar').doc(snap.id)
    .delete()

    tasks.push(userEventRef)
  })


  return await Promise.all(tasks).then(() => true)
})

exports.classroomInfoChanged = functions.firestore
.document('meetings/{meeting}')
.onUpdate((change, context) => {
  let meetingId = context.params.meeting
  if (change.after.data().title !== change.before.data().title) {
    console.log('changing classroom title')
    let newTitle = change.after.data().title
    
    return admin.firestore()
    .collection('meetings').doc(meetingId)
    .collection('current_attendance').get().then((querySnap) => {
      let batch = admin.firestore().batch()

      querySnap.forEach((doc) => {
        let userRef = admin.firestore()
        .collection('users').doc(doc.id)
        .collection('meetings').doc(meetingId)
        
        
        batch.update(userRef, {
          "group.title": newTitle
        })
      })
  
      return batch.commit()
    })
  } else return true ;
})

exports.sendDirectMessagePN = functions.firestore
.document('meetings/{meetingId}/current_attendance/{userId}/direct_messages/{messageId}/messages/{msgId}')
.onCreate((snap, context) => {
  const senderId = context.params.userId
  const { author, text, meeting, timeSent, } = snap.data()

  if  (author.id !== senderId) return true;


  let alert = {
    item: {
      text,
      type: 'newMessage',
      timeSent,
      author: author,
    },
    meeting: meeting,
    type: 'newMessage',
  }

  let message = {
    notification: {
      title: `${author.displayName} has direct messaged you`,
      body: text,
    },
    data: {
      group: author.id,
      screen: 'meetingStream',
      meetingId: meetingId,
    },
    token: token,
  }

  let sendPN = admin.messaging().send(message)
  let sendAlert = admin.firestore()
  .collection('users').doc(user.id)
  .collection('subscriptions').add(alert)

  Promise.all([ sendPN, sendAlert ]).then(() => {
    return true
  }).catch((err) => {
    console.log(err)
  })
})

exports.createExpressAccount = functions.firestore
.document('users/{userId}/create_connect_express/{connectExpId}')
.onCreate(async(snap, context) => {
  try {
    let userId = context.params.userId
  
    const account = await stripe.accounts.create({
      type: 'express',
    })
  
    return admin.firestore()
    .collection('teacher_assistants').doc(userId)
    .update({
      expressAccount: account,
    })
  } catch(err) {
    console.log(err)
  }
})

exports.createLink = functions.firestore
.document('users/{userId}/create_link/{connectExpId}')
.onCreate(async (snap, context) => {
  try {    
    const accountLink = await stripe.accountLinks.create({
      account: snap.data().expressAccount.id,
      refresh_url: 'https://us-central1-tickets-79e75.cloudfunctions.net/stripeRefreshURL',
      return_url: 'https://demiaapp.page.link/',
      type: 'account_onboarding',
    })
  
    return admin.firestore()
    .collection('teacher_assistants').doc(snap.data().id)
    .update({
      expressLink: accountLink.url,
      expressLinkExpires:  accountLink.expires_at
    })
  } catch(err) {
    return console.log(err)
  }
})

exports.stripeRefreshURL = functions.https.onRequest((req, res) => {
  console.log('request',req)
  res.redirect('https://demiaapp.page.link/') 
})

// exports.stripeRefreshURL = functions.https.onRequest((req, res) => {
//   console.log('request',req)
//   res.redirect('https://demiaapp.page.link/') 
// })

exports.sendVerificationCode = functions.firestore
.document('phone_verification/{phoneID}')
.onWrite((change, context) => {
  let to = change.after.data().phoneNumber
  
  if (change.after.data().code && change.after.data().status === 'sent') {
    return twilio.verify.services('your-service-id-here')
    .verificationChecks
    .create({to, code: change.after.data().code })
    .then(res => {
      console.log(res.status)
      if (res.status === 'approved') {
        return Promise.all([
          change.after.ref.update({ code: '', status: res.status }),
          admin.firestore()
          .collection('users').doc(change.after.data().userId)
          .update({
            phoneNumber: to,
          })
        ]) 
      }
    }).catch((err) => {
      return change.after.ref.update({ status: 'error' , error: err})
    })
  } else if (change.after.data().status === 'pending') {
    return twilio.verify.services('your-service-id-here')
    .verifications
    .create({ to, channel: 'sms'})
    .then(verification => {
      return change.after.ref.update({ status: 'sent' })
    })
    .catch((err) => {
      return change.after.ref.update({ status: 'error' , error: err})
    })
  }
})

const workers =  {
  assignmentDue: async ({ item, meeting }) => {

    let assignmentSubs = await admin.firestore()
    .collection('meetings').doc(meeting.id)
    .collection('assignments_subs').get()

    let tokens = []
    let receiverRefs = []

    assignmentSubs.forEach((doc) => {
      let sendSub = admin.firestore()
      .collection('users').doc(item.author.id)
      .collection('subscriptions').add({item, meeting, type: 'assignment_due'})
      
      let sendEvent = admin.firestore()
      .collection('users').doc(item.author.id)
      .collection('calendar').add({item, meeting, type: 'assignment_due'})

      receiverRefs.push(sendSub)
      receiverRefs.push(sendEvent)
      if (doc.data().fcmToken) tokens.push(doc.data().fcmToken)
    })

    let message = {
      notification: {
        title: `${meeting.name} has an assignment due soon`,
        body: `${item.title} is due ${moment(item.dueDate).format('MMM Do h:mm a')}`,
      },
      data: {
        group: item.author.id,
        screen: 'meetingStream',
        subScreen: 'assignments',
        meetingId: meeting.id,
      },
      tokens: tokens,
    }

    let sendPN = tokens.length?admin.messaging().sendMulticast(message):true

    return Promise.all([ ...receiverRefs, sendPN ])
  },
  pollExpirationImminent: async ({ item, meeting }) => {
    let pollSubs = await admin.firestore()
    .collection('meetings').doc(meeting.id)
    .collection('polls_subs').get()

    let tokens = []
    let receiverRefs = []
    pollSubs.forEach((doc) => {
      if (doc.data().fcmToken) tokens.push(doc.data().fcmToken)

      let sendSub = admin.firestore()
      .collection('users').doc(doc.data().id)
      .collection('subscriptions')
      .add({item, meeting, type: 'poll_expiration_imminent'})
      
      receiverRefs.push(sendSub)
    })

    let message = {
      notification: {
        title: `A poll in ${meeting.title} is expiring soon`,
        body: `Don't forget to vote!`,
      },
      data: {
        group: item.author.id,
        screen: 'meetingStream',
        subScreen: 'polls',
        meetingId: meeting.id,
      },
      tokens: tokens,
    }

    let sendPN = tokens.length?admin.messaging().sendMulticast(message):true

    return Promise.all([ ...receiverRefs, sendPN ])
  },
  pollExpired: async ({ item, meeting, }) => {

    let pollSubs = await admin.firestore()
    .collection('meetings').doc(meeting.id)
    .collection('polls_subs').get()

    let tokens = []
    let receiverRefs = []

    pollSubs.forEach((doc) => {
      let sendSub = admin.firestore()
      .collection('users').doc(item.author.id)
      .collection('subscriptions').add({item, meeting, type: 'poll_expired'})
      
      receiverRefs.push(sendSub)
      if (doc.data().fcmToken) tokens.push(doc.data().fcmToken)
    })

    let message = {
      notification: {
        title: `A poll in ${meeting.title} has expired`,
        body: `The poll titled ${item.title} has results viewable`,
      },
      data: {
        group: item.author.id,
        screen: 'meetingStream',
        subScreen: 'polls',
        meetingId: meeting.id,
      },
      tokens: tokens,
    }

    let sendPN = tokens.length?admin.messaging().sendMulticast(message):true
    return Promise.all([ ...receiverRefs, sendPN ])
  },
  eventStarted: async ({ meeting, item }) => {
    let eventSubs = await admin.firestore()
    .collection('meetings').doc(meeting.id)
    .collection('events_subs').get()

    let tokens = []
    let receiverRefs = []

    eventSubs.forEach((doc) => {

      let sendSub = admin.firestore()
      .collection('users').doc(doc.data().id)
      .collection('subscriptions')
      .add({item, meeting, type: 'event_started'})
      
      receiverRefs.push(sendSub)
      if (doc.data().fcmToken) tokens.push(doc.data().fcmToken)
    })

    let message = {
      notification: {
        title: `The event "${item.title}" has started`,
        body: `${meeting.title} has started an event`,
      },
      data: {
        group: item.author.id,
        screen: 'meetingStream',
        subScreen: 'polls',
        meetingId: meeting.id,
      },
      tokens: tokens,
    }

    let sendPN = tokens.length?admin.messaging().sendMulticast(message):true

    return Promise.all([ ...receiverRefs, sendPN ])
  },
  eventImminent: async ({ meeting, item }) => {
    let pollSubs = await admin.firestore()
    .collection('meetings').doc(meeting.id)
    .collection('events_subs').get()

    let tokens = []
    let receiverRefs = []

    pollSubs.forEach((doc) => {
      let sendSub = admin.firestore()
      .collection('users').doc(doc.data().id)
      .collection('subscriptions')
      .add({item, meeting, type: 'event_imminent'})
      
      receiverRefs.push(sendSub)
      if (doc.data().fcmToken) tokens.push(doc.data().fcmToken)
    })

    let message = {
      notification: {
        title: `An event: ${item.title} is starting soon`,
        body: `${item.description}`,
      },
      data: {
        group: item.author.id,
        screen: 'meetingStream',
        subScreen: 'events',
        meetingId: meeting.id,
      },
      tokens: tokens,
    }

    let sendPN = tokens.length?admin.messaging().sendMulticast(message):true

    return Promise.all([ ...receiverRefs, sendPN ])    
  },
}

exports.callWorkers = functions.runWith({ memory: '2GB'})
.pubsub.schedule('every 2 minutes')
.onRun( async () => {
    let now = admin.firestore.Timestamp.now()
  
    // define query
    let query = admin.firestore()
    .collection('tasks')
    .where('performAt', '<=', now)
    .where('status', '==', 'scheduled')
  
    let tasks = await query.get()
    if (tasks.empty) {
      return 'No tasks'
    }
  
    // array of promises
    let jobs = []
  
    tasks.forEach(snap => {
      const { worker, options } = snap.data()
  
      const job = workers[worker](options)
      .then(() => snap.ref.delete())
      .catch((err) => {
        // console.log(err) 
        return snap.ref.update({ status: 'error', log: err.message })
      })
  
      jobs.push(job)
    })
    // execute all jobs
    return Promise.all([jobs]).then(() => true)
    .catch((err) => console.log(err))
})