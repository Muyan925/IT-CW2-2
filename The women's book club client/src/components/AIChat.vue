<template>
    <div :class="isIcon ? 'chat icon' : 'chat'">
        <i class="el-icon-error close" @click="isIcon = true"></i>
        <div class="title">ChatGPT</div>
        <div class="loading">
            <span v-show="isLoading">chat-gpt正在输入……</span>
        </div>
        <ul class="msg-content" ref="mc">
            <li v-for="(item, index) in messageList" :key="index" :class="item.type">
                <img v-if="item.type === 'receive'" src="../assets/images/ai.png" alt="" srcset="" />
                <img v-if="item.type === 'send'" :src="userImage" alt="" srcset="" />
                <div class="message-box">
                    {{ item.content }}
                </div>
            </li>
        </ul>
        <div class="ipt-content">
            <textarea ref="t" v-model="keywords" name="" id="" cols="30" rows="10" placeholder="输入你的问题"></textarea>
            <button class="btn submit" @click="sendMessage">发送</button>
        </div>
        <div class="mask" v-show="isIcon" @click="isIcon = false">AI</div>
    </div>
</template>

<script>
export default {
    name: "AIChat",
    data() {
        return {
            messageList: [
                // {
                //     type: 'receive',
                //     content: '123'
                // },
                // {
                //     type: 'send',
                //     content: 'asdhf'
                // }
            ],
            keywords: "",
            isLoading: false,
            isIcon: true,
        };
    },
    methods: {
        sendMessage() {
            if (this.isLoading) {
                return;
            }
            if (!this.keywords || this.keywords === "\n" || this.keywords === "\r") {
                this.$message.info("请输入问题");
                return;
            }
            console.log(this.keywords);
            this.isLoading = true;
            this.messageList.push({
                type: "send",
                content: this.keywords,
            });
            this.$nextTick(() => {
                this.$refs.mc.scrollTop = "10000000";
            });
            this.getAnswer(this.keywords);
            this.keywords = "";
        },

        // 发送API请求和接收响应，直到收到终止信号

        sendRequest() {
            let responseText = "";
            const url = "https://api.openai.com/v1/chat/completions";
            const headers = {
                "Content-Type": "application/json",
                Authorization: "Bearer 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",
            };
            const data = {
                model: "gpt-3.5-turbo",
                prompt: "Hello,",
                temperature: 0.5,
                max_tokens: 50,
                stop: "###",
            };
            return this.$axios
                .post(url, data, { headers })
                .then((response) => {
                    const responseJson = response.data;
                    responseText += responseJson.choices[0].text;
                    if (!responseText.includes("###")) {
                        return sendRequest();
                    } else {
                        return responseText;
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        // 输出结果

        getAnswer(keywords) {
        //     this.sendRequest().then((result) => {
        //         console.log(result);
        //     });
            this.$axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-3.5-turbo",
                messages: [{"role": "user", "content": keywords}],
                stream: true
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer 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"
                }
            }).then(response => {
                if (response.status === 200) {
                    this.messageList.push({
                        type: 'receive',
                        content: response.data.choices[0].message.content
                    })
                }
                this.isLoading = false
                this.$nextTick(() => {
                    this.$refs.mc.scrollTop = '10000000'
                })
            })
        },
    },
    computed: {
        userImage() {
            return this.$store.getters["getUserPhoto"];
        },
    },
    mounted() {
        // window.addEventListener('keyup', (e) => {
        //     if (e.target.localName === 'textarea' && e.code === 'Enter') {
        //         e.preventDefault()
        //         this.sendMessage()
        //     }
        // })
    },
};
</script>

<style scoped>
.chat {
    overflow: hidden;
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 500px;
    height: 700px;
    background-color: #fff;
    z-index: 999;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 30px 2px rgba(0, 0, 0, 0.3);
    transition: all 0.5s;
}

.title {
    font-size: 24px;
    height: 30px;
    line-height: 30px;
    margin-bottom: 10px;
    text-align: center;
    color: #E8B2B9;
}

.loading {
    height: 20px;
    text-align: center;
    color: #696969;
    font-size: 12px;
}

.msg-content {
    overflow-y: scroll;
    width: 100%;
    height: 460px;
    background-color: #efefef;
    padding: 10px;
}

.msg-content li {
    display: flex;
    align-content: center;
    /* background-color: red; */
    margin-bottom: 20px;
}

.msg-content li img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.message-box {
    max-width: 240px;
    min-width: 60px;
    /* height: 40px; */
    background-color: #fff;
    padding: 10px;
    border-radius: 5px;
    margin-left: 10px;
}

.send {
    flex-direction: row-reverse;
}

.send .message-box {
    margin-right: 10px;
    margin-left: 0;
    background-color: #E8B2B9;
    color: #fff;
}

.ipt-content {
    position: relative;
    height: 140px;
    /* background-color: aliceblue; */
}

.ipt-content textarea {
    width: 100%;
    height: 100%;
    border: none;
    /* background-color: red; */
    background-color: transparent;
    padding: 10px 0;
    font-size: 16px;
    resize: none;
    outline: none;
}

.submit {
    position: absolute;
    bottom: 0;
    right: 0;
}

.close {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 20px;
    color: #E8B2B9;
}

.icon {
    width: 40px;
    height: 40px;
}

.icon .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    line-height: 40px;
    background-color: #E8B2B9;
    z-index: 100000;
    text-align: center;
    color: #fff;
    cursor: pointer;
}
</style>