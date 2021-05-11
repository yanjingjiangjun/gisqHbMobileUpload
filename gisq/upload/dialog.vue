<template>
    <div class="dialog" v-show="showMask">
        <div class="dialog-container">
            <div class="dialog-title">{{title}}</div>
            <div class="content" v-html="content"></div>
            <div class="btns">
                <div v-if="type != 'confirm'" class="default-btn" @click="closeBtn">
                    {{cancelText}}
                </div>
                <div v-if="type == 'danger'" class="danger-btn" @click="dangerBtn">
                    {{dangerText}}
                </div>
                <div v-if="type == 'confirm'" class="confirm-btn" @click="confirmBtn">
                    {{confirmText}}
                </div>
            </div>
            <div class="close-btn" @click="closeMask"><i class="iconfont-gisqupload icon-close"></i></div>
        </div>
        
    </div>
</template>
<script>
export default {
    props: {
        value: {},
        // 类型包括 defalut 默认， danger 危险， confirm 确认，
        type:{
            type: String,
            default: 'default'
        },
        content: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        dangerText: {
            type: String,
            default: '删除'
        },
        confirmText: {
            type: String,
            default: '确认'
        },
    },
    data(){
        return{
            showMask: false,
        }
    },
    methods:{
        closeMask(){
            this.showMask = false;
        },
        closeBtn(){
            this.$emit('cancel');
            this.closeMask();
        },
        dangerBtn(){
            this.$emit('danger');
            this.closeMask();
        },
        confirmBtn(){
            this.$emit('confirm');
            this.closeMask();
        }
    },
    mounted(){
        this.showMask = this.value;
    },
    watch:{
        value(newVal, oldVal){
            this.showMask = newVal;
        },
        showMask(val) {
            this.$emit('input', val);
        }
    },
}
</script>
<style>
    .dialog{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 9999;
    }
	.dialog-container{
	    width: 240px;
	    height: 200px;
	    background: #ffffff;
	    position: absolute;
	    top: 50%;
	    left: 50%;
	    transform: translate(-50%, -50%);
	    border-radius: 8px;
	    position: relative;
	}
	.dialog-title{
	    width: 100%;
	    height: 60px;
	    font-size: 18px;
	    color: #696969;
	    font-weight: 600;
	    padding: 16px 50px 0 20px;
	    box-sizing: border-box;
	}
	.content{
	    color: #797979;
	    line-height: 26px;
	    padding: 0 20px;
	    box-sizing: border-box;
	}
	.inp{
	    margin: 10px 0 0 20px;
	    width: 200px;
	    height: 40px;
	    padding-left: 4px;
	    border-radius: 4px;
	    border: none;
	    background: #efefef;
	    outline: none;
	    
	}
	.inp:focus{
	    border: 1px solid #509EE3;
	}
	.btns{
	    width: 100%;
	    height: 60px;
	    position: absolute;
	    bottom: 0;
	    left: 0;
	    text-align: center;
	    padding: 0 16px;
	    box-sizing: border-box;
		font-size: 16px;
	}
	.btns>div{
		display: inline-block;
		height: 36px;
		width: 80px;
		line-height: 36px;
		background: #f1f1f1;
		border-radius: 8px;
		margin-right: 12px;
		cursor: pointer;
		text-align: center;
	}
	.default-btn{
	    color: #787878;
	}
	.default-btn:hover{
	    color: #509EE3; 
	}
	.danger-btn{
	    background: #EF8C8C !important;
		color:#000000;
	    
	}
	.danger-btn:hover{
	    background: rgb(224, 135, 135);
	}
	.danger-btn:active{
	    background: #EF8C8C;
	}
	.confirm-btn{
	    color: #ffffff;
	    background: #509EE3;
	    
	}
	.confirm-btn:hover{
	    background: #6FB0EB;
	}
	.close-btn{
	    position: absolute;
	    top: 8px;
	    right: 8px;
	    width: 30px;
	    height: 30px;
	    line-height: 30px;
	    text-align: center;
	    font-size: 18px;
	    cursor: pointer;
	}
	.close-btn:hover{
	    font-weight: 600;
	}
</style>
