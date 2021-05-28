import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'
import './DayView.css'
import {BsChevronDoubleLeft, BsChevronDoubleRight, BsChevronLeft, BsChevronRight } from 'react-icons/bs'


export default props => 
      <div className="container-fluid ">
          <Calendar
            className='border cal'
            calendarType="US"
            nextLabel={<BsChevronRight/>}
            next2Label={<BsChevronDoubleRight/>}
            prevLabel={<BsChevronLeft/>}
            prev2Label={<BsChevronDoubleLeft />}
            onChange={props.changeDay}
            value={props.date}
            onClickDay={props.dayClick}
          />
      </div>