<template>
  <div class="view">
    <div class="title">
        Book Management
        <div class="right">
            <span class="note-name">{{name}}</span>
            <span class="download"><a :href='"http://localhost:8081" + location' download :target="location">Download</a></span>
        </div>
    </div>
    <v-md-editor v-model="text" height="80vh" @save="saveFile" @upload-image="handleUploadImage" :disabled-menus="[]"></v-md-editor>
  </div>
</template>

<script>

export default {
    name: 'MarkdownView',
    data() {
        return {
            text: '',
        }
    },
    computed: {
        name() {
            return this.$route.query.name
        },
        location() {
            return this.$route.query.location
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1)
        },
        getNoteInfo() {
            this.$axios.get('/Note/GetNoteInfo?fileLocation=' + this.location).then(response => {
                console.log(response.data);
                if (response.data.flag) {
                    this.text = response.data.data
                } else {
                    this.$message.error(response.data.msg)
                }
            })
        },
        saveFile(text, html) {
            console.log(text);
            this.$axios.post('/notes/' + this.$route.query.location.substring(6), text,{
                headers: {
                    "Content-Type": "text/plain; charset=utf-8"
                }
            }).then(response => {
                if (response.data.flag) {
                    this.$message.success(response.data.msg)
                } else {
                    this.$message.error(response.data.msg)
                }
            })
        },
        handleUploadImage(event, insertImage, files) {
            // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
            // console.log(files);
            const formData = new FormData()
            formData.append('image', files[0])

            this.$axios.post('/notes/upload', formData).then(response => {
                if (response.data.flag) {
                    this.$message.success(response.data.msg)
                    insertImage({
                        url: response.data.data,
                        desc: files[0].name,
                        width: 'auto',
                        height: 'auto',
                    });
                } else {
                    this.$message.error(response.data.msg)
                }
            })

        },
    },
    mounted() {
        this.getNoteInfo()
    },
}
</script>

<style scoped>
.title {
    font-size: 24px;
    margin-bottom: 20px;
}

.v-md-editor {
    overflow: hidden;
    border-radius: 10px;
    /* border: 1px solid #ccc;
    box-shadow: none; */

}

.title {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    /* background-color: pink; */
}

.right {
    display: flex;
    align-items: flex-end;
    font-size: 16px;
}

.right .note-name {
    /* background-color: red; */
    margin-right: 10px;
    font-size: 20px;
    color: #E8B2B9;
}

.download a {
    font-size: 16px;
    color: #575757;
    cursor: pointer;
}

.download a:hover {
    color: #E8B2B9;
    text-decoration: underline;
}
</style>