'use strict';

import React from 'react';
import moment from 'moment';
import momentISO from 'moment-isocalendar';
 module.exports = React.createClass({
     getInitialState: function() {
         const {dateRange} = this.props;
         let current = moment(new Date()).isocalendar();
        return {
            dateRange: {
                startDate: dateRange && dateRange.startDate ? dateRange.startDate : null,
                endDate: dateRange && dateRange.endDate ? dateRange.endDate : current
            },
            yearRang: {
                startYear: dateRange && dateRange.startDate ? dateRange.startDate[0]: current[0]-1,
                endYear: dateRange && dateRange.endDate ? dateRange.endDate[0]: current[0],
            },
            selectDate: {
                selectStartDate: dateRange && dateRange.startDate ? (dateRange.startDate[0]+ '-' +dateRange.startDate[1]): null,
                selectEndDate: dateRange && dateRange.endDate ? (dateRange.endDate[0]+ '-' +dateRange.endDate[1]) : (current[0] + '-' + current[1])
            }
        }
     },
     handleSelectWeek: function (year,week){
         console.log(year,week);
     },
     handleSelectYear: function(direction){
         const {yearRang,dateRange,selectDate} =this.state;
         let startYear = direction ==='right'? (yearRang.startYear+1) : (yearRang.startYear-1);
         let endYear = direction ==='right'? (yearRang.endYear+1): (yearRang.endYear-1);
         let selectStartDate,selectEndDate;

        if(direction === 'right') {
            selectStartDate = selectDate.selectEndDate;
            selectEndDate = selectDate.selectStartDate
        } else {
            selectStartDate = selectDate.selectStartDat
            selectEndDate = selectDate.selectEndDate;
        }
        this.setState({
            yearRang: {
                startYear: startYear,
                endYear: endYear
            },
            selectDate: {
                selectStartDate: selectStartDate,
                selectEndDate: selectEndDate
            }
        })
        console.log(selectDate)
     },
     handleDealDate: function(selectYear) {
         let nextDates =moment(new Date(selectYear+1, 0, 1)).isocalendar();
         let monthDays = nextDates[0] != selectYear ? (31 - nextDates[2]) : 31
         let dates = moment(new Date(selectYear, 11, monthDays)).isocalendar();
         let weeks = dates[1];
         let year = dates[0]
         let datas = [];
         for(let i=0; i < weeks;i++) {
             datas.push({
                 value: i+1,
                 year: year,
                 dateRange: moment.fromIsocalendar([year,i,7,0]).format('YYYY-MM-DD') +'/'+ moment.fromIsocalendar([year,i+1,7,0]).format('YYYY-MM-DD')
             })
         }
         return datas;
     },
     render: function() {
         const {yearRang,dateRange,selectDate} = this.state;
         let select_1 = this.handleDealDate(yearRang.startYear);
         let select_2 = this.handleDealDate(yearRang.endYear);
         return (
             <div className="week_box">
                <div className="week_table">
                    <div className="week_caption">
                        {yearRang.startYear}
                        <i className="fa fa fa-caret-left left"
                            onClick={this.handleSelectYear.bind(this,'left')}
                            >
                        </i>
                    </div>
                    <div className="week_body">
                     {select_1.map((item,i)=>{
                         return (
                             <span key={i}
                                 className={(item.year+ '-'+item.value) == selectDate.selectStartDate && 'active'}
                                 onClick={this.handleSelectWeek.bind(this,item.year,item.value)}>
                                 {item.value}
                             </span>
                         )
                     })}
                    </div>
                 </div>
                 <div className="week_table">
                     <div className="week_caption">
                         {yearRang.endYear}
                        <i className="fa fa fa-caret-right right"
                            onClick={this.handleSelectYear.bind(this,'right')}
                             >
                        </i>
                     </div>
                    <div className="week_body">
                     {select_2.map((item,i)=>{
                         return (
                             <span key={i}
                                 className={(item.year+'-'+item.value) == selectDate.selectEndDate && 'active'}
                                 onClick={this.handleSelectWeek.bind(this,item.year,item.value)}>
                                 {item.value}
                             </span>
                         )
                     })}
                    </div>
                 </div>
             </div>
         )
     }
 })
