import React, {useState} from 'react';
import {Dropdown} from 'semantic-ui-react'

const TimePickerInput: React.FC = () => {
  let options = ['super', 'man', 'bat','man']
  return (
    <Dropdown placeholder='Change' search selection options={options} />
  );
}

export default TimePickerInput;
