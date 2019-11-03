import React, {Component} from 'react'
import { Dropdown, Input } from 'semantic-ui-react'
import moment from 'moment'


class TimePickerInput extends Component {
  constructor(props){
    super(props)
    let {use12Hours, interval, format, value, showDuration, startTime, style} = this.props

    showDuration = showDuration ? true : false
    use12Hours = use12Hours ? true : false
    interval = interval ? interval : 1
    format = format ? format : 'HH:mm'
    let momentVal = value ? moment(value) : ''
    value = value ? moment(value).format(format) : ''

    this.state = {value, momentVal, openDropdown:false, use12Hours, interval, format, showDuration, startTime, style}
  }

  componentWillReceiveProps(nextProps){
    this.initValue(nextProps)
  }

  initValue = (prop) => {
    let {use12Hours, interval, format, value, showDuration, startTime} = prop

    showDuration = showDuration ? true : false
    use12Hours = use12Hours ? true : false
    interval = interval ? interval : 1
    format = format ? format : 'HH:mm'
    let momentVal = value ? moment(value) : ''
    value = value ? moment(value).format(format) : ''

    this.setState({value, momentVal, openDropdown:false, use12Hours, interval, format, showDuration, startTime})
    this.generateTime( use12Hours, interval, format, showDuration, startTime, momentVal )
  }

  componentWillMount(){
    let {use12Hours, interval, format, showDuration, startTime, momentVal} = this.state
    this.generateTime( use12Hours, interval, format, showDuration, startTime, momentVal )
  }

  getDuration = (start, end) => {
    var day, formats, hour, minute, second, week;
    second = 1e3;
    minute = 6e4;
    hour = 36e5;
    day = 864e5;
    week = 6048e5;

    formats = {
      seconds:' sec',
      minutes:' min',
      hours:' hr',
      days:' day'
    };

    var diff, num, unit, unitStr;

    diff = Math.abs(start.diff(end));
    unit = null;
    num = null;
    if (diff <= second) {
      unit = 'minutes';
      num = 0;
    } else if (diff < minute) {
      unit = 'seconds';
    } else if (diff < hour) {
      unit = 'minutes';
    } else if (diff < day) {
      unit = 'hours';
    } else if (diff < week) {
      unit = 'days';
    }

    if (!(num && unit)) {
      if(unit === 'minutes') num = Math.round(Math.abs(start.diff(end,unit, true)));
      else num = Math.round(Math.abs(start.diff(end,unit, true)) * 100) / 100
    }

    unitStr = unit = formats[unit];
    if (num > 1) {
      unitStr += 's';
    }
    return num + unitStr;

  }

  generateTime = (use12Hours, interval, format, showDuration, startTime, momentVal) => {
    let optionTime = []

    if(!use12Hours){
      let loopTime = interval ? 60/interval*24 : 60*24

      let time = moment(momentVal).startOf('d')
      for (var i = 0; i < loopTime; i++) {
        let value = moment(time).add(i*interval,'m')
        let text = moment(time).add(i*interval,'m').format(format)

        let disabled = moment(value).format('YYYYMMDDHHmm') < moment().format('YYYYMMDDHHmm') ? true : false

        if(startTime) disabled = moment(value).format('YYYYMMDDHHmm') < moment(startTime).format('YYYYMMDDHHmm') ? true : false
        if(showDuration) text = `${text} (${this.getDuration(moment(value,format), moment(startTime))})`

        optionTime.push({key:i, value:moment(value).format(format), text, disabled})
      }
    }

    this.setState({optionTime})
  }

  timeFormatChecker = (value) =>{
    return /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value)
  }

  onBlur = () => {
    setTimeout(()=>this.setState({openDropdown : false}), 500)
  }

  onChange = (e,{value}) => {
    let {format, openDropdown} = this.state

    let checkedFormat = this.timeFormatChecker(value)
    if(checkedFormat){
      openDropdown = false
      this.props.onChange(moment(value, format), value)
    }
    this.setState({value, openDropdown})
  }

  onSelect = (e,{value}) => {
    let {format} = this.state

    this.props.onChange(moment(value, format), value)
    this.setState({openDropdown:false, value})
  };

  render(){
    let {openDropdown, optionTime, value, style} = this.state

    style = style ? style : {flex:1}

    // <div className={`ui scrolling dropdown timepickerinput ${openDropdown ? 'visible' : ''}`}>
    //   <div className='menu transition' style={{marginTop:'-1em'}}>
    //     {optionTime.map(option=><div
    //       className={`item
    //         ${option.disabled ? ' disabled' : ''}
    //         ${option.value === value ? ' active selected' : ''}
    //       `}
    //       data-value={option.value}><span className='text'>{option.text}</span></div>)
    //     }
    //   </div>
    // </div>

    return (
      <div style={style}>
        <Input
          onChange={this.onChange}
          onFocus={()=>this.setState({openDropdown:true})}
          onBlur={this.onBlur}
          value={value}
        >
          <input className='ant-calendar-picker-input ant-input ant-input-lg'/>
        </Input>
          <Dropdown open={openDropdown} icon={''} closeOnBlur scrolling value={value} upward={false} className='timepickerinput'>
            <Dropdown.Menu style={{marginTop:'-1em'}}>
              {optionTime.map(option=><Dropdown.Item
                key={option.key}
                text={option.text}
                value={option.value}
                disabled={option.disabled}
                onClick={this.onSelect}
                active={option.value === value ? true : false}
                selected={option.value === value ? true : false}/>)
              }
            </Dropdown.Menu>
          </Dropdown>
      </div>
    )
  }
}

export default TimePickerInput
