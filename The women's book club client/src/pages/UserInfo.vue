<template>
  <div class="user">
    <div class="title">
        <span class="name">Hello, {{ user.userName }}</span>
        <!-- <el-tooltip class="item" effect="dark" :content="saying" placement="top">
            <span class="saying">{{ saying }}</span>
        </el-tooltip> -->
        
    </div>
    <div class="content">
       <div>Basic personal information</div>
        <div class="row">
            <ul class="infos">
                <li>
                    <span>UID</span><span>{{user.userId}}</span>
                </li>
                <li>
                    <span>userName</span><span v-show="!onEdit">{{user.userName}}</span><input v-model="user.userName" type="text" v-show="onEdit">
                </li>
                <li>
                    <span>gender</span><span v-show="!onEdit">{{user.userGender}}</span>
                    <el-select style="width: 300px; height: 30px;" v-model="user.userGender" v-show="onEdit">
                        <el-option value="Secret"></el-option>
                        <el-option value="Male"></el-option>
                        <el-option value="Female"></el-option>
                    </el-select>
                </li>
                <li>
                    <span>Address</span><span v-show="!onEdit">{{user.userAddress}}</span><input v-model="user.userAddress" type="text" v-show="onEdit">
                </li>
                <li>
                    <span>Email</span><span v-show="!onEdit">{{user.userEmail}}</span><input v-model="user.userEmail" type="text" v-show="onEdit">
                </li>
                <li>
                    <span>Brief introduction</span><span v-show="!onEdit">{{user.userInfo}}</span>
                    <el-input
                    v-show="onEdit"
                    type="textarea"
                    placeholder="Please enter content"
                    maxlength="100"
                    v-model="user.userInfo"
                    show-word-limit
                    style="width: 300px; vertical-align: top;"
                    >
                    </el-input>
                </li>
            </ul>
            <div class="right">
                <div class="photo">
                    <label>
                        <input type="file" name="" id="" style="display: none;" @change="updatePhoto" accept="image/*">
                        <img :src="user.userImage" alt="" srcset="">
                    </label>
                    <span class="tips">Click to upload image</span>
                </div>
                <div class="opts">
                    <button class="change-pwd btn" @click="dialogFormVisible = true">Change your password</button>
                    <button class="edit-info btn" @click="showEdit">{{ onEdit ? 'Save Changes' : 'Edit Information' }}</button>
                </div>
            </div>
        </div>
    </div>
    <el-dialog title="change your password" :visible.sync="dialogFormVisible">
        <el-form label-width="80px">
            <el-form-item label="original password">
                <el-input v-model="oldPassword"></el-input>
            </el-form-item>
            <el-form-item label="new password">
                <el-input v-model="newPassword"></el-input>
            </el-form-item>
            <el-form-item label="Confirm Password">
                <el-input v-model="confirmPassword"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addDialogFormVisible = false">Cancel</el-button>
            <el-button type="primary" @click="handleModifyPassword">OK</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
    name: 'UserInfo',
    data() {
        return {
            dialogFormVisible: false,
            onEdit: false,
            user: {
                userId: '',
                userName: '',
                userGender: '',
                userAddress: '',
                userEmail: '',
                userInfo: ''
            },
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
           
        }
    },
    methods: {
        getSaying() {
            fetch('https://api.uixsj.cn/hitokoto/get').then(res => res.text()).then(text => {
                this.saying = text
            })
        },
        showEdit() {
            this.onEdit = !this.onEdit
            if (!this.onEdit) {
                this.handleModify()
            }
        },
        handleModify() {
            this.$axios.post('/user/UpdateUserBasicInfoByUid', this.user).then(response => {
                if (response.data.flag) {
                    this.$message.success(response.data.msg)
                } else {
                    this.$message.error(response.data.msg)
                }
            })
        },
        getUserInfo() {
            this.$axios.get(`/user/GetUserInfoByUid/${this.uid}`).then(response => {
                if (response.data.flag) {
                    this.user = response.data.data
                    this.$store.dispatch('saveUserInfo', this.user)
                } else {
                    this.$message.error(response.data.msg)
                }
            })
        },
        updatePhoto(e) {
            if (e.currentTarget.files.length === 0) {
                return
            }
            const formData = new FormData()
            formData.append('photo', e.currentTarget.files[0])
            this.$axios.post(`/user/UpdateUserPhotoByUid/${this.uid}`, formData).then(response => {
                if (response.data.flag) {
                    this.$message.success(response.data.msg)
                    this.getUserInfo()
                } else {
                    this.$message.error(response.data.msg)
                }
            })
        },
        handleModifyPassword() {
            if (this.newPassword != this.confirmPassword) {
                this.$message.info('New password does not match the confirmation password')
            } else {
                const formData = new FormData()
                formData.append('uId', this.uid)
                formData.append('oldPassword', this.oldPassword)
                formData.append('newPassword', this.newPassword)
                this.$axios.post('/user/UpdateUserPasswordByUid', formData).then(response => {
                    if (response.data.flag) {
                        this.$message.success(response.data.msg)
                        this.dialogFormVisible = false
                    } else {
                        this.$message.error(response.data.msg)
                    }
                })
            }
        }
    },
    computed: {
        uid() {
            return this.$store.getters['getUserId']
        }
    },
    created() {
        this.getSaying()
        this.getUserInfo()
    }
}
</script>

<style scoped>
.title {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 20px;
}

.name {
    font-size: 24px;
}

.saying {
    overflow: hidden;
    display: inline-block;
    font-size: 14px;
    color: rgb(108, 108, 108);
    /* background-color: red; */
    max-width: 400px;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.content {
    min-width: 620px;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 10px;
}

.content>div:first-child {
    font-size: 14px;
    color: rgb(26, 26, 26);
    margin-bottom: 30px;
}

.row {
    display: flex;
}

.infos li {
    min-width: 400px;
    height: 30px;
    line-height: 30px;
    margin: 20px 0;
    font-size: 16px;
    /* background-color: red; */
}

.infos li:nth-child(3) {
    height: 40px;
    /* background-color: pink; */
    line-height: 40px;
}


.infos li:last-child {
    height: 54px;
    /* background-color: red; */
}

.infos li span:first-child {
    display: inline-block;
    width: 100px;
}

.infos li span:nth-child(2) {
    display: inline-block;
    width: 300px;
    /* background-color: red; */
    
}

.infos li input {
    outline: none;
    /* border: none;
    border-bottom: 1px solid #ccc; */
    border-radius: 5px;
    border: 1px solid #ddd;
    height: 30px;
    width: 300px;
    font-size: 16px;
    text-indent: 14px;
    transition: all .3s;
}

.infos li input:hover {
    border-color: #ccc;
}

.infos li input:focus {
    border-color: #E8B2B9;
}

.right {
    display: flex;
    min-width: 162px;
    flex-direction: column;
    margin-left: 30px;
    align-items: center;
}

.photo {
    overflow: hidden;
    position: relative;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    margin-top: 20px;
    margin-bottom: 80px;
}

.tips {
    display: none;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 30px;
    padding: 5px;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    font-size: 12px;
    text-align: center;
    color: #fff;
}

.photo:hover .tips {
    display: block;

}

.photo:hover img {
    filter: blur(5px) brightness(0.8);

}
.photo img {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    transition: all .2s;
}

.opts button:first-child {
    margin-right: 10px;
}

/* .el-input
.el-input--suffix {
    height: 30px !important;
}

.el-input input {
    height: 30px;
    line-height: 30px;
} */
</style>