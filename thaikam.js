Vue.component('word-ch', {
  template: '<div v-bind:class="[pos, chClass, qch]">{{ ch }}</div>',
  props: ['character', 'position', 'number'],
  data: function (){
    return {
      pos: "pos-" + this.position,
      chClass: "ch-close",
      ch: '_', qch:'q-ch'
    };
  },
  methods: {
    change : function() {
        this.chClass = "ch-open";
        this.ch = this.character;
    },

    check: function () {
      if (this.chClass === "ch-open") return true;
      return false;
    }
  }
});

let app = new Vue({
  el: "#app",
  data: {
    word: '',
    summary: '',
    answer: '',
    ensureAnswer: true,
    cannotOpen: false,
    structure: [],
    wordClass: [],
    totalCh: 0,
    indexWord: []
  },
  beforeMount: function () {
    axios.get('word.json')
    .then(function (response) {
      let id = Math.floor(Math.random()*response.data.length);
      app.word = response.data[id].word;
      app.structure = response.data[id].structure;
      app.totalCh = app.word.length;
      app.indexWord = [...Array(app.totalCh).keys()];
    })
    .catch(function (error) {
      console.log(error);
    });
  },
  methods: {
    getResult: function(event) {
      if (this.answer === this.word) {
        this.summary = 'ถูกต้อง';
      } else {
        this.summary = 'ผิด';
      }
      this.ensureAnswer = false;
    },
    randomChar: function(event) {
      if (this.indexWord.length <= 1) return null;
      let rand = Math.floor(Math.random()*this.indexWord.length);
      let item = this.indexWord[rand];
      if (rand !== undefined) {
        app.$refs.wordch[item].change();
        this.indexWord.splice(rand, 1);
        if (this.indexWord.length <= 1) this.cannotOpen = true;
      }
    },
    openAll: function(event) {
      if (this.indexWord.length < 1) return null;
      for (let index of this.indexWord) {
        app.$refs.wordch[index].change();
      }
    }
  }
});
