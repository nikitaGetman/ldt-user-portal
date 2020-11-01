<template>
  <div class="dashboard">
    <h3 class="dashboard__title">Найти четвероногого друга</h3>

    <div class="dashboard__params">
      <el-row class="dashboard__filter-row" :gutter="20">
        <el-col :span="6">
          <el-select v-model="shelter" clearable placeholder="Приют">
            <el-option
              v-for="(item, index) in params.shelters"
              :key="index"
              :label="item.shortName"
              :value="item.shortName"
            />
          </el-select>
        </el-col>

        <el-col :span="3">
          <el-select v-model="type" clearable placeholder="Тип животного">
            <el-option v-for="(item, index) in params.animalTypes" :key="index" :label="item.value" :value="item.key" />
          </el-select>
        </el-col>

        <el-col :span="3">
          <el-select v-model="sex" clearable placeholder="Пол животного">
            <el-option v-for="(item, index) in params.animalSex" :key="index" :label="item" :value="item"> </el-option>
          </el-select>
        </el-col>

        <el-col :span="3">
          <el-button plain icon="el-icon-search" @click="search" class="dashboard__search">Искать</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="dashboard__list-wrapper">
      <ul
        class="dashboard__list"
        v-infinite-scroll="fetch"
        infinite-scroll-disabled="infiniteScrollDisabled"
        v-if="animalsList.length > 0"
      >
        <el-row :gutter="0">
          <el-col :span="4" v-for="(item, index) in animalsList" :key="index" :offset="index % 5 > 0 ? 1 : 0">
            <v-animal-card :animal="item" @request="createRequest(item)"></v-animal-card>
          </el-col>
        </el-row>
      </ul>
      <p class="dashboard__list-info" v-if="loading"><i class="el-icon-loading"></i> Загрузка...</p>
      <p class="dashboard__list-info" v-if="isAllLoaded">Все данные загружены</p>
    </div>

    <!-- dialog -->
    <el-dialog title="Заявка" :visible.sync="createRequestVisible" width="30%" class="dashboard__dialog">
      <el-form label-width="120px" :model="newRequest" size="small">
        <el-form-item label="Ваше имя">
          <el-input v-model="newRequest.name" />
        </el-form-item>

        <el-form-item label="Ваш телефон">
          <el-input v-model="newRequest.phone" />
        </el-form-item>

        <el-form-item label="Сообщение">
          <el-input v-model="newRequest.message" />
        </el-form-item>
      </el-form>

      <div slot="footer" v-loading="loading">
        <el-button @click="createRequestVisible = false">Отмена</el-button>
        <el-button @click="sendRequest" class="v-send-request">Отправить</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VAnimalCard from '@/components/VAnimalCard.vue'
import { FETCH_DICTS, FETCH_ANIMALS, CREATE_REQUEST, MODULE_NAME as ANIMALS_MODULE } from '@/store/modules/animals'

export default {
  name: 'Dashboard',
  components: { VAnimalCard },
  data() {
    return {
      shelter: null,
      type: null,
      sex: null,

      activeAnimal: null,
      createRequestVisible: false,

      newRequest: {
        name: '',
        phone: '',
        comment: ''
      }
    }
  },
  computed: {
    module() {
      return this.$store.state[ANIMALS_MODULE]
    },
    params() {
      return this.module.model
    },
    loading() {
      return this.module.loading
    },
    animalsList() {
      return this.module.list
    },
    isAllLoaded() {
      return !this.loading && this.module.params.offset === this.module.params.count
    },
    infiniteScrollDisabled() {
      return this.loading || this.isAllLoaded
    }
  },
  created() {
    this.$store.dispatch(FETCH_DICTS)
    this.fetch()
  },
  methods: {
    fetch(options = {}) {
      const { shelter, type, sex } = this
      this.$store.dispatch(FETCH_ANIMALS, {
        shelter,
        type,
        sex,
        ...options
      })
    },
    search() {
      this.fetch({ offset: 0 })
    },
    createRequest(animal) {
      this.activeAnimal = animal
      this.createRequestVisible = true
    },
    sendRequest() {
      const animalId = this.activeAnimal.id
      const { phone, name, comment } = this.newRequest
      this.$store
        .dispatch(CREATE_REQUEST, { animalId, phone, name, comment })
        .then(() => {
          this.$notify({
            title: 'Заявка отправлена',
            message: 'Заявка успешно создано, работник приюта скоро с Вами свяжется',
            type: 'success'
          })
          this.createRequestVisible = false
        })
        .catch(() => {
          this.$notify({
            title: 'Ошибка',
            message: 'Не удалось создать заявку',
            type: 'error'
          })
        })
    }
  }
}
</script>

<style lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;

  &__dialog {
    .el-dialog__body {
      padding-bottom: 4px;
    }
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 10px;
    }
    .el-form-item--small .el-form-item__content,
    .el-form-item--small .el-form-item__label {
      margin-bottom: 2px;
    }

    .v-send-request {
      color: #c22;
      border-color: #c22;

      &:hover {
        color: #c22;
        border-color: #c22;
        background-color: #fff3f3;
      }
      &:focus {
        color: #c22;
        border-color: #c22;
        background-color: #fff4f4;
      }
    }
  }

  &__search {
    &:hover {
      color: #c22 !important;
      border-color: #c22 !important;
    }
    &:focus {
      color: #c22 !important;
      border-color: #c22 !important;
    }
  }

  &__title {
    margin: 12px 0 24px;
    padding: 0;
  }

  &__filter-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    .el-col > * {
      width: 100%;
    }
  }
  &__list-wrapper {
    overflow: auto;
    margin-top: 24px;
    padding-bottom: 32px;
  }
  &__list {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  &__list-info {
    margin: 32px 0 0;
    text-align: center;
  }
}
</style>
