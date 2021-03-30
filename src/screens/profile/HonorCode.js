import React, { useEffect, useState } from 'react'
import {
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native'
import {
  Block
} from '../../common'

import { 
  BubbleBackBtn
} from '../../buttons'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

import FastImage from 'react-native-fast-image'
import illus from '../../../assets/illus/Illus'


let general = `The Honor Code is Demia’s policy on academic integrity. It articulates Demia expectations and commitment to maintaining a culture of academic integrity where all members are expected to maintain the highest academic values.

Demia does not condone, and will not participate in, academic dishonesty. Tutors will not take tests nor complete a graded assignment on your behalf. Tutors may not knowingly help a student cheat, plagiarize, or engage in any action that violates the academic honor code of the class or the school.

Good tutoring is more than simply giving out answers to questions. We encourage, engaging and interactive teaching, helping students fully grasp and understand concepts, and developing effective problem-solving solutions.`

let students = `The Demia team understands the pressures inherent to the academic environment that school creates. However, the risk you take by violating your school's code of academic integrity is not worth the reward. Copying solutions or requesting unexplained final answers promotes completion without comprehension, which is something we don't support on this site.`

let teacherAssistants = `At Demia, we give you great responsibility in handling yourself with students using our service. As current students yourselves, we trust that you understand the principles of academic integrity, but would like to remind you that you're required to uphold the following practices:
Strictly adhere to the above Demia Honor Code in all tutoring interactions.
Convey that tutoring is not a replacement for students attending class or doing their homework. The tutor's role is to help students understand concepts and develop effective problem-solving approaches.

Any evidence that you have knowingly facilitated cheating will be cause for your immediate suspension from the site and review of your case.`



function HonorCode(props) {
  return (
    <Block>
      <BubbleBackBtn title="Honor Code"/>

      <ScrollView style={{flex: 1}}>
      <FastImage 
          style={{
            width: wp('100'),
            height: wp('45'),
            opacity: .8
          }}
          source={illus.brainstorm}
        />
        <Text style={styles.header1}>Honor Code</Text>
        <Text style={styles.header2}>Demia is a resource that allows students to connect with their peers</Text>
        <Text style={styles.paragraph}>{general}</Text>
        <Text style={styles.header3}>For students</Text>
        <Text style={styles.paragraph}>{students}</Text>
        <Text style={styles.header3}>For teacher's assistants</Text>
        <Text style={styles.paragraph}>{teacherAssistants}</Text>
      </ScrollView>
    </Block>
  )
}

const styles = {
  header1: {
    margin: wp('2'),
    fontSize: wp('5'),
    fontFamily: 'Montserrat-Bold',
    color: 'dimgrey',
  },
  header2: {
    margin: wp('2'),
    fontSize: wp('5'),
    fontFamily: 'Montserrat-Medium',
    color: 'dimgrey',  
  },
  header3: {
    margin: wp('2'),
    fontSize: wp('4'),
    fontFamily: 'Montserrat-Bold',
    color: 'dimgrey',  
  },
  paragraph: {
    margin: wp('2'),
    fontSize: wp('4'),
    fontFamily: 'Montserrat-Medium',
    color: '#454545',  
  },
}
export default HonorCode