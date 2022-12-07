import { csrfFetch } from "./csrf";

export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
export const A_SPOT = 'spots/A_SPOT';
export const CREATE_SPOT = 'spots/CREATE_SPOT';
export const UPDATE_SPOT = 'spots/UPDATE_SPOT';
export const DELETE_SPOT = 'spots/DELETE_SPOT';
export const ADD_IMAGE = 'spots/ADD_IMAGE';

const load = (spotsList) => ({
  type: LOAD_SPOTS,
  spotsList
});

const aSpot = (spot) => ({
  type: A_SPOT,
  spot
});

const create = spot => ({
  type: CREATE_SPOT,
  spot
});

const addImage = img => ({
  type: ADD_IMAGE,
  img
})

const update = (spot, id) => ({
  type: UPDATE_SPOT,
  spot,
  id
});

const deletion = (id) => ({
  type: DELETE_SPOT,
  id
});

export const getSpots = () => async dispatch => {
  const response = await fetch('/api/spots');

  if (response.ok) {
    const list = await response.json();
    dispatch(load(list));
  };
};

export const getSpotCurrentUser = () => async dispatch => {
  const response = await csrfFetch('/api/spots/current');

  if(response.ok) {
    const currentUserSpots = await response.json();
    dispatch(load(currentUserSpots));
  };
};

export const getASpot = spotId => async dispatch => {
  const response = await fetch(`/api/spots/${spotId}`);

  if (response.ok) {
    const spot = await response.json();
    // console.log('spot:', spot)
    dispatch(aSpot(spot))
  };
};

export const createSpot = (spot, img) => async dispatch => {
  const response = await csrfFetch(`/api/spots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spot)
  });
  // console.log('here')
  if (response.ok) {
    const newSpot = await response.json();

    const res = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: img,
        preview: true
      })
    });

    if(res.ok) {
      const spotWImage = await res.json();
      dispatch(create(spotWImage));
      return spotWImage;
    };
  };
};

// export const addImage = (img, spotId) => async dispatch => {
//   const response = await csrfFetch(`/api/spots/${spotId}/images`)
// }

export const updateSpot = (spot, id) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spot)
  });

  if(response.ok) {
    const updatedSpot = await response.json();
    // console.log('this is working', updatedSpot)
    dispatch(update(updatedSpot));
    return updatedSpot;
  };
};

export const deleteSpot = (id) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${id}`, {
    method: 'DELETE'
  });

  if(response.ok) {
    // const deletedSpot = await response.json();
    dispatch(deletion(id));
    // return ('Successfully deleted');
  }
}

const initialState = {
  allSpots: {},
  singleSpot: {
    SpotImages: []
  }
}

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
      const allSpots = {}
      const singleSpot = {}
      action.spotsList.Spots.forEach(spot => {
        allSpots[spot.id] = spot
      });
      // console.log('newState: ', newState)
      return {
        allSpots,
        singleSpot
      }
    case A_SPOT:
      return {
        ...state,
        singleSpot: action.spot.Spots[0]
      }
    case UPDATE_SPOT:
    case CREATE_SPOT:
      const createState = {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.spot.id]: action.spot
        },
        singleSpot: {
          ...state.singleSpot,
        }
      }
      createState.singleSpot = action.spot
      return createState;
    case DELETE_SPOT:
      const deleteState = {
        allSpots: { ...state.allSpots },
        singleSpot: { ...state.singleSpot }
      }
      // console.log('this about to be yeeted', deleteState)
      if (deleteState.singleSpot.id === action.id) {
        deleteState.singleSpot = {}
      }
      delete deleteState.allSpots[action.id];
      return deleteState;
    default:
      return state;
  }
}

export default spotsReducer;
