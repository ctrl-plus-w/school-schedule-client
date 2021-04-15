import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import { v4 as uuidv4 } from 'uuid';

import Time from '../../../../../utils/Time';
import { getWeekDay, getMonth } from '../../../../../utils/Calendar';

import ModalContext from '../../../../../context/modal-context';

// import './index.scss';

// TODO : [-] Refactor getEventElement function (try grouping events into one element).
// TODO : [ ] Handle event click.
// TODO : [ ] Get more infos when fetching events.

const Day = (props) => {
  const modalContext = useContext(ModalContext);

  const nineArray = new Array(9).fill(0);

  const events = nineArray.reduce((acc, curr, i) => {
    const event = props.infos.events.find((event) => parseInt(event.start.hours) === i + 8);
    if (event) return [...acc, event];
    else return [...acc, { id: uuidv4(), start: new Time(i + 8, 0), empty: true, selected: false }];
  }, []);

  const handleEventClick = (_event, event) => {
    // TODO : [ ] Handle click event.

    modalContext.config({
      title: event.subject,
      link: event.link,
      description: event.description,
      start: event.start.toString,
      pin: event.obligatory ? 'Obligatoire' : '',
      pinColor: 'red',
      subjectOwner: event.owner,
    });
  };

  const getEventElement = (eventsArray, i) => {
    const prev = eventsArray[i - 1];
    const curr = eventsArray[i];
    const next = eventsArray[i + 1];

    const emptyCell = () => <div className={`event empty `} key={curr.id}></div>;

    const cell = (type, content = false) => (
      <div className={`event ${type} ${curr.color}`} key={curr.id} onClick={(e) => handleEventClick(e, curr)}>
        {content && <h3 className='title'>{curr.subject}</h3>}
        {content && <p className='description'>{curr.start.toString}</p>}
      </div>
    );

    if (curr.empty) return emptyCell();

    if (!prev || prev.empty) {
      if (next?.subject === curr?.subject) return cell('start', true);
      return cell('normal', true);
    }

    if ((!next || next.empty) && prev.subject === curr.subject) return cell('end');

    // If next is an event and prev as well.
    if (!next.empty && !prev.empty) {
      if (next.subject === curr.subject && prev.subject === curr.subject && prev.subject === next.subject) return cell('middle');
      if (prev.subject === curr.subject && curr.subject !== next.subject) return cell('end');

      if (prev.subject !== curr.subject && curr.subject === next.subject) return cell('middle', true);
    }

    return cell('end', true);
  };

  return (
    <div className='day'>
      <div className='header'>
        <h3 className='title'>
          {getWeekDay(props.infos.date)} {props.infos.date.getDate()} {getMonth(props.infos.date)}
        </h3>
      </div>
      <div className='events student-events'>{events.map((el, i) => getEventElement(events, i))}</div>
    </div>
  );
};

Day.propTypes = {
  infos: PropTypes.object,
};

export default Day;