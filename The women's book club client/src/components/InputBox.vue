<template>
    <div class="input-box">
      <input
        :type="type"
        @blur="check"
        v-model="inputValue"
        @focus="onceFocus = true"
      />
      <span class="highlight"></span>
      <span class="bar"></span>
      <label :class="inputValue ? 'up' : ''">{{ label }}</label>
      <span class="error" v-show="isRequired && !isError">This must be input!</span>
      <span class="error" v-show="isError">{{ errorText }}</span>
      <i v-show="required" class="tag">*</i>
    </div>
  </template>
  
  <script>
  export default {
    name: "InputBox",
    props: {
      type: {
        type: String,
        default: "text",
      },
      label: {
        type: String,
        default: "",
      },
      pattern: {
        type: String,
        default: "",
      },
      errorText: {
        type: String,
        default: "Error!",
      },
      value: {
        type: String,
        default: "",
      },
      required: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        isError: false,
        isRequired: false,
        onceFocus: false,
        inputValue: "",
      };
    },
    methods: {
      check() {
        const rgx = new RegExp(this.pattern);
  
        if (this.inputValue) {
          this.isError = !rgx.test(this.inputValue);
          this.isRequired = false;
        } else {
          this.isError = false;
          if (this.onceFocus) {
            this.isRequired = this.required;
          }
        }
        this.$emit("input", this.inputValue);
        this.$emit("onBlur", this.inputValue)
      },
    },
  };
  </script>
  
  <style scoped>
  /* form starting stylings ------------------------------- */
  .input-box {
    position: relative;
    /* background-color: purple; */
    width: 240px;
    height: 70px;
    padding-top: 20px;
  }
  input {
    font-size: 18px;
    padding: 5px 5px 5px 5px;
    display: block;
    width: 240px;
    border: none;
    border-bottom: 1px solid #757575;
  }
  input:focus {
    outline: none;
  }
  
  /* LABEL ======================================= */
  label {
    color: #999;
    font-size: 18px;
    font-weight: normal;
    position: absolute;
    pointer-events: none;
    left: 5px;
    top: 25px;
    transition: 0.2s ease all;
    -moz-transition: 0.2s ease all;
    -webkit-transition: 0.2s ease all;
  }
  
  /* active state */
  input:focus ~ label,
  .up {
    top: 0px;
    left: 0;
    font-size: 14px;
    color: #E8B2B9;
  }
  
  .tag {
      position: absolute;
      left: -8px;
      top: 25px;
      color: red;
      font-style: normal;
  }
  
  /* input:invalid ~ label {
    top:-20px;
    font-size:14px;
    color:#5264AE;
  } */
  
  /* BOTTOM BARS ================================= */
  .bar {
    position: relative;
    display: block;
    width: 240px;
  }
  .bar:before,
  .bar:after {
    content: "";
    height: 2px;
    width: 0;
    bottom: 1px;
    position: absolute;
    background: #E8B2B9;
    transition: 0.2s ease all;
    -moz-transition: 0.2s ease all;
    -webkit-transition: 0.2s ease all;
  }
  .bar:before {
    left: 50%;
  }
  .bar:after {
    right: 50%;
  }
  
  .error {
    position: absolute;
    bottom: 0;
    font-size: 12px;
    color: red;
    /* background-color: blue; */
  }
  
  /* active state */
  input:focus ~ .bar:before,
  input:focus ~ .bar:after {
    width: 50%;
  }
  
  /* HIGHLIGHTER ================================== */
  .highlight {
    position: absolute;
    height: 60%;
    width: 100px;
    top: 25%;
    left: 0;
    pointer-events: none;
    opacity: 0.5;
  }
  
  /* active state */
  input:focus ~ .highlight {
    -webkit-animation: inputHighlighter 0.3s ease;
    -moz-animation: inputHighlighter 0.3s ease;
    animation: inputHighlighter 0.3s ease;
  }
  
  /* ANIMATIONS ================ */
  @-webkit-keyframes inputHighlighter {
    from {
      background: #E8B2B9;
    }
    to {
      width: 0;
      background: transparent;
    }
  }
  @-moz-keyframes inputHighlighter {
    from {
      background: #E8B2B9;
    }
    to {
      width: 0;
      background: transparent;
    }
  }
  @keyframes inputHighlighter {
    from {
      background: #E8B2B9;
    }
    to {
      width: 0;
      background: transparent;
    }
  }
  </style>