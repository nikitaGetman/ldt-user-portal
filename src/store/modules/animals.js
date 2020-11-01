import { throwError } from '@/store/utils'
import { LOADING, LOADED, SET_LIST, UPDATE_PARAMS, SET_MODEL } from '@/store/mutations/types'

export const FETCH_ANIMALS = 'fetchAnimals'
export const FETCH_DICTS = 'fetchShelters'
export const CREATE_REQUEST = 'createRequest'

export const MODULE_NAME = 'animals'

export default {
  state: {
    loading: false,
    model: {
      shelters: []
    },
    list: [],
    params: {
      limit: 10,
      offset: 0,
      count: null
    }
  },

  actions: {
    [FETCH_DICTS]: ({ commit, getters }) => {
      return getters.apiService
        .fetchDicts()
        .then(model => {
          commit(SET_MODEL, { name: MODULE_NAME, model })
        })
        .catch(throwError(commit, 'Ошибка получения списка приютов (fetchShelters)'))
    },
    [FETCH_ANIMALS]: ({ state, commit, getters }, searchParams = {}) => {
      const params = { ...state.params, ...searchParams }
      if (params.offset === 0) {
        commit(SET_LIST, { name: MODULE_NAME, list: [] })
        commit(UPDATE_PARAMS, { name: MODULE_NAME, params: { offset: 0 } })
      }
      if (state.params.offset === state.params.count) return

      commit(LOADING, MODULE_NAME)
      return getters.apiService
        .fetchAnimals(params)
        .then(response => {
          const list = response[0]
          const count = response[1]
          commit(SET_LIST, { name: MODULE_NAME, list: [...state.list, ...list] })
          commit(UPDATE_PARAMS, {
            name: MODULE_NAME,
            params: { offset: params.offset + list.length, count }
          })
        })
        .catch(throwError(commit, 'Ошибка получения списка животных (fetchAnimals)'))
        .finally(() => commit(LOADED, MODULE_NAME))
    },
    [CREATE_REQUEST]: ({ commit, getters }, { animalId, phone, name, comment }) => {
      commit(LOADING, MODULE_NAME)
      return getters.apiService
        .createRequest({ animal: animalId, phone, name, comment })
        .catch(throwError(commit, 'Ошибка создания запроса (createRequest)'))
        .finally(() => commit(LOADED, MODULE_NAME))
    }
  }
}
