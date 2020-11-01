<template>
  <el-card :body-style="{ padding: '0px' }" class="animal-card">
    <el-image class="image animal-card__image">
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>
    </el-image>
    <div style="padding: 8px;">
      <span>{{ cardTitle }}</span>
      <div class="bottom clearfix">
        <span class="description">{{ cardDescription }}</span>
        <el-button type="text" class="button" @click="createRequest">Посмотреть</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'VAnimalCard',
  props: {
    animal: { type: Object, required: true }
  },
  computed: {
    cardTitle() {
      return `${this.animal.nickname}, ${this.animal.age}`
    },
    cardDescription() {
      return ''
    }
  },
  methods: {
    createRequest() {
      this.$emit('request')
    }
  }
}
</script>

<style lang="scss">
.animal-card {
  margin-bottom: 24px;
}

.description {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 7px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;

  &:hover {
    color: #409eff !important;
    text-decoration: underline;
  }
  &:focus {
    color: #409eff !important;
  }
}

.image {
  width: 100%;
  min-height: 180px;
  line-height: 180px;
  text-align: center;
  font-size: 32px;
  color: #bbb;
  background-color: #ddd;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
</style>
