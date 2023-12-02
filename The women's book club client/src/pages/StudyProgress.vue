<template>
    <div>
      <!-- 学习进度管理组件 -->
      <StudyProgress />
  
      <!-- 评论部分 -->
      <div class="comments">
        <h2>Comment</h2>
        <div v-for="(comment, index) in comments" :key="index" class="comment">
          <div class="comment-content">{{ comment.content }}</div>
          <div class="comment-info">{{ comment.author }} • {{ comment.date }}</div>
          <div class="comment-actions">
            <button @click="editComment(index)">edit</button>
            <button @click="deleteComment(index)">Delete</button>
          </div>
        </div>
  
        <!-- 添加/编辑评论表单 -->
        <form @submit.prevent="submitComment">
          <textarea v-model="newComment" placeholder="Add comments here"></textarea>
          <button type="submit">{{ editingIndex === null ? 'Submit ' : 'Save' }}</button>
          <button type="button" @click="cancelEdit" v-if="editingIndex !== null">Cancel Editing</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  // 引入学习进度管理组件
  import StudyProgress from './StudyProgress.vue';
  
  export default {
    components: {
      StudyProgress,
    },
    data() {
      return {
        // 评论数据
        comments: [
          { id: 1, content: 'Helpful！', author: 'UserA', date: '2023-11-25' },
          { id: 2, content: 'I like romantic novels in this book club', author: 'UserB', date: '2023-11-26' },
          // 其他评论数据...
        ],
        newComment: '', // 用于存储新的评论
        editingIndex: null, // 用于标记当前正在编辑的评论的索引
      };
    },
    methods: {
      submitComment() {
        if (this.newComment.trim() === '') {
          // 确保评论内容不为空
          return;
        }
  
        if (this.editingIndex === null) {
          // 添加新评论
          this.comments.unshift({
            id: Date.now(), // 使用时间戳作为唯一标识符
            content: this.newComment,
            author: 'Me', // 在实际应用中，你可能需要获取用户的真实信息
            date: new Date().toLocaleDateString(),
          });
        } else {
          // 保存编辑
          this.$set(this.comments, this.editingIndex, {
            ...this.comments[this.editingIndex],
            content: this.newComment,
          });
  
          // 取消编辑状态
          this.editingIndex = null;
        }
  
        // 清空新评论输入框
        this.newComment = '';
      },
      editComment(index) {
        // 进入编辑状态
        this.editingIndex = index;
        // 设置编辑表单内容为当前评论内容
        this.newComment = this.comments[index].content;
      },
      deleteComment(index) {
        // 删除评论
        this.comments.splice(index, 1);
  
        // 如果删除的是正在编辑的评论，取消编辑状态
        if (this.editingIndex === index) {
          this.editingIndex = null;
          this.newComment = '';
        }
      },
      cancelEdit() {
        // 取消编辑状态
        this.editingIndex = null;
        // 清空编辑表单内容
        this.newComment = '';
      },
    },
  };
  </script>
  
  <style scoped>
  /* 样式可以根据需要进行调整 */
  
  .comments {
    margin-top: 40px;
  }
  
  .comment {
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-bottom: 10px;
    padding: 10px;
  }
  
  .comment-content {
    font-size: 16px;
  }
  
  .comment-info {
    font-size: 12px;
    color: #666;
  }
  
  .comment-actions {
    margin-top: 5px;
  }
  
  textarea {
    width: 100%;
    margin-bottom: 10px;
    padding: 5px;
    font-size: 14px;
  }
  
  button {
    background-color: #E8B2B9;
    color: white;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 5px;
  }
  
  button:hover {
    background-color: #E8B2B9;
  }
  
  button[type="button"] {
    background-color: #ccc;
    color: #333;
  }
  
  button[type="button"]:hover {
    background-color: #bbb;
  }
  </style>
  
  