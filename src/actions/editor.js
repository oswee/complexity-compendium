export const EDITING_START = 'EDITING_START';
export const EDITING_FINISH = 'EDITING_FINISH';
export const EDITING_TITLE_UPDATED = 'EDITING_TITLE_UPDATED';
export const EDITING_BODY_UPDATED = 'EDITING_BODY_UPDATED';
export const EDITING_SECTION_UPDATED = 'EDITING_SECTION_UPDATED';
export const EDITING_SLUG_ADDED = 'EDITING_SLUG_ADDED';
export const EDITING_NAME_UPDATED = 'EDITING_NAME_UPDATED';
export const EDITING_SUBSTANTIVE_UPDATED = 'EDITING_SUBSTANTIVE_UPDATED';

import {
  userMayEdit
} from '../reducers/user.js';

import {
  cardSelector
} from '../reducers/data.js'

import {
  modifyCard
} from './data.js';

export const editingStart = () => (dispatch, getState) => {
  const state = getState();
  if (!userMayEdit(state)) {
    console.warn("This user is not allowed to edit!")
    return;
  }
  const card = cardSelector(state)
  if (!card || !card.id) {
    console.warn("There doesn't appear to be an active card.");
    return;
  }
  dispatch({type: EDITING_START, card: card});
}

export const editingCommit = () => (dispatch, getState) => {
  const state = getState();
  if (!userMayEdit(state)) {
    console.warn("This user isn't allowed to edit!");
    return;
  }
  const underlyingCard = cardSelector(state);
  if (!underlyingCard || !underlyingCard.id) {
    console.warn("That card isn't legal");
    return;
  }

  const updatedCard = state.editor.card;

  let update = {};

  if (updatedCard.title != underlyingCard.title) update.title = updatedCard.title;
  if (updatedCard.body != underlyingCard.body) update.body = updatedCard.body;
  if (updatedCard.section != underlyingCard.section) update.section = updatedCard.section;
  if (updatedCard.name != underlyingCard.section) update.name = updatedCard.name;

  //modifyCard will fail if the update is a no-op.
  dispatch(modifyCard(underlyingCard, update, state.editor.substantive));

}

export const editingFinish = () => {
  return {type: EDITING_FINISH}
}

export const titleUpdated = (newTitle) => {
  return {
    type: EDITING_TITLE_UPDATED,
    title:newTitle,
  }
}

export const bodyUpdated = (newBody) => {
  return {
    type: EDITING_BODY_UPDATED,
    body: newBody
  }
}

export const sectionUpdated = (newSection) => {
  return {
    type: EDITING_SECTION_UPDATED,
    section: newSection
  }
}

export const slugAdded = (newSlug) => {
  return {
    type: EDITING_SLUG_ADDED,
    slug: newSlug
  }
}

export const nameUpdated = (newName) => {
  return {
    type: EDITING_NAME_UPDATED,
    name: newName
  }
}

export const substantiveUpdated = (checked) => {
  return {
    type: EDITING_SUBSTANTIVE_UPDATED,
    checked,
  }
}