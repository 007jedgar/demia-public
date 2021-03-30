import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function navigateAndDo(name, params, {andDo}) {
  navigationRef.current?.navigate(name, params);
  andDo()
}

export function goBackAndDo({ andDo }) {
  navigationRef.current?.goBack()
  andDo()
}

export function goBack() {
  navigationRef.current?.goBack()
}

export function reset(name, params) {
  navigationRef.current?.reset(name, params)
}

export function replace(name, params) {
  navigationRef.current?.replace(name, params)
}