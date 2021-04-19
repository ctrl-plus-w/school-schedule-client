/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { X } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';

import { hide, selectInfos, selectVisible } from '../../../features/modals/createSlice';
import { fetchSubjects, selectSubjects } from '../../../features/database/subjectsSlice';
import { createEvent, fetchLabelEvents } from '../../../features/database/eventsSlice';

import { selectEvents, editEvent, selectLabel, removeDay } from '../../../features/infos/infosSlice';

import Selector from '../../Selector';

import { getWeekDay, getMonth } from '../../../utils/Calendar';
import Time from '../../../utils/Time';

// TODO : [ ] Focus on the field when visible.
// TODO : [ ] Handle form submit.
// TODO : [ ] Reset selected on when visible.

import { getHour, find } from '../../../utils/Utils';

const CreationModal = () => {
  const dispatch = useDispatch();

  const [selected, setSelected] = useState({});

  const infos = useSelector(selectInfos);
  const subjects = useSelector(selectSubjects);
  const selectedEvents = useSelector(selectEvents);
  const label = useSelector(selectLabel);
  const visible = useSelector(selectVisible);

  useEffect(() => {
    if (!visible) return;

    setSelected(null);
    dispatch(fetchSubjects());
  }, [visible]);

  const handleContentClick = (event) => {
    event.stopPropagation();
  };

  const handleClose = () => {
    setSelected({});
    dispatch(hide());
  };

  const handleSetSelected = (item) => {
    setSelected(item);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selected) return;
    if (!label?.id) return;

    const day = Object.keys(selectedEvents)[0];

    for (const event of selectedEvents[day]) {
      const startTime = find(selectedEvents[day], getHour(event.start), -1);

      const description = document.querySelector(`#start${startTime ? startTime : getHour(event.start)}`);

      const [hour, min] = event.start.split(':').map(parseFloat);
      const date = new Date(new Date(day).setHours(hour, min));

      const payload = {
        start: date,
        description: description.value,
        obligatory: event.obligatory,
        label_id: label.id,
        subject_id: selected.id,
      };

      // ! Must be await, otherwise it wont wait for the events
      // ! to be created before fetching thems.
      await dispatch(createEvent(payload));
    }

    // TODO : [x] Stop if their is no others days after and show "Validation" instead of "Suivant". Check if the day isn't empty.
    // TODO : [ ] Refetch all the events after creating some.
    // TODO : [x] Reset selected value.

    if (Object.keys(selectedEvents).length <= 1) dispatch(hide());

    dispatch(removeDay(Object.keys(selectedEvents)[0]));
    dispatch(fetchLabelEvents({ id: label.id }));
  };

  const mapHours = (events, day) => {
    return events.map(({ start, obligatory }) => {
      const currHour = getHour(start);

      const prevHour = find(events, currHour, -1);
      const nextHour = find(events, currHour, +1);

      const handleClick = () => {
        dispatch(editEvent({ date: day, start, obligatory: !obligatory }));
      };

      const getHourElement = (h1, h2) => {
        return (
          <div className='hour' key={start}>
            <p className='start'>
              {h1} - {h2}
              <span className={`pin ${obligatory ? 'red' : 'green'}`} onClick={handleClick}>
                {obligatory ? 'Obligatoire' : 'Facultatif'}
              </span>
            </p>
            <label className='description' htmlFor={`start${getHour(start)}`}>
              Description
              <input type='text' id={`start${getHour(start)}`} placeholder='Veuillez entrer une description.' />
            </label>
          </div>
        );
      };

      if (!prevHour && nextHour) return getHourElement(start, new Time(nextHour + 1, 0).toString);
      if (!prevHour && !nextHour) return getHourElement(start, new Time(currHour + 1, 0).toString);
    });
  };

  const getFirstDay = () => {
    const day = Object.keys(selectedEvents)[0];

    if (selectedEvents[day] && selectedEvents[day].length > 0)
      return (
        <div className='day-container'>
          <h3 className='day-name'>
            {getWeekDay(new Date(day))} {new Date(day).getDate()} {getMonth(new Date(day))}
          </h3>
          <div className='hours-list'>{mapHours(selectedEvents[day], day)}</div>
        </div>
      );
  };

  return (
    <form className={`modal ${infos.visible ? 'visible' : 'hidden'}`} onClick={handleClose} onSubmit={handleSubmit}>
      <div className='modal-content' onClick={handleContentClick}>
        <header>
          <h1 className='title'>
            {infos.title} - {label.name}
          </h1>
          <X className='icon' onClick={handleClose} size={28} />
        </header>

        <div className='content'>
          <p className='description'>{infos.description}</p>

          {getFirstDay()}

          <div className='fields'>
            <div className='form-group'>
              <Selector
                items={subjects.map((s) => ({ id: s.id, name: s.subject_name }))}
                selected={selected}
                setSelected={handleSetSelected}
                placeholder='Choisir un sujet'
                className='field'
                onSubmit={handleSubmit}
                noValidation
              />
              <button type='submit' className={`submit-button ${!selected && 'disabled'}`}>
                {Object.keys(selectedEvents).length <= 1 ? 'Valider' : 'Suivant'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreationModal;