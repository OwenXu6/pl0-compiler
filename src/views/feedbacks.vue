<template>
	<div class="container">

		<el-tabs v-model="message">
			<el-tab-pane :label="`未解决反馈(${state.unread.length})`" name="first">
				<el-table :data="state.unread" :show-header="false" style="width: 100%">
					<el-table-column>
						<template #default="scope">
							<span v-if="!scope.row.edit" class="message-feedbackTitle">{{ scope.row.feedbackTitle }}</span>
							<el-input v-else v-model="scope.row.feedbackTitle"></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="feedbackSendTime" width="180"></el-table-column>
					<el-table-column width="120">
						<template #default="scope">
							<el-button size="small" @click="handleRead(scope.$index)">标为已解决</el-button>
						</template>
					</el-table-column>
					<el-table-column width="60">
						<template #default="scope">
							<el-button size="small" @click="handleView(scope.$index)">查看</el-button>
						</template>
					</el-table-column>

					<el-table-column width="60">
						<template #default="scope">
							<el-button size="small" @click="handleReply(scope.$index)">回复</el-button>
							<el-input v-if="showReplyBox && currentReplyIndex === scope.$index" v-model="currentReply"
								:style="{ width: '300px', height: '100px' }"></el-input>
						</template>
					</el-table-column>

				</el-table>
				<div class="handle-row">
					<el-button type="primary">全部标为已解决</el-button>
				</div>
			</el-tab-pane>
			<el-tab-pane :label="`已解决反馈(${state.read.length})`" name="second">
				<template v-if="message === 'second'">
					<el-table :data="state.read" :show-header="false" style="width: 100%">
						<el-table-column>
							<template #default="scope">
								<span class="message-feedbackTitle">{{ scope.row.feedbackTitle }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="feedbackSendTime" width="150"></el-table-column>
						<el-table-column label="回复内容">
							<template #default="scope">
								{{ scope.row.replyContent }}
							</template>
						</el-table-column>
						<el-table-column width="120">
							<template #default="scope">
								<el-button type="danger" @click="handleDel(scope.$index)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="handle-row">
						<el-button type="danger">删除全部</el-button>
					</div>
				</template>
			</el-tab-pane>

			<el-tab-pane :label="`回收站(${state.recycle.length})`" name="third">
				<template v-if="message === 'third'">
					<el-table :data="state.recycle" :show-header="false" style="width: 100%">
						<el-table-column>
							<template #default="scope">
								<span class="message-feedbackTitle">{{ scope.row.feedbackTitle }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="feedbackSendTime" width="150"></el-table-column>
						<el-table-column width="120">
							<template #default="scope">
								<el-button @click="handleRestore(scope.$index)">还原</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="handle-row">
						<el-button type="danger">清空回收站</el-button>
					</div>
				</template>
			</el-tab-pane>
		</el-tabs>

		<el-dialog feedbackTitle="回复反馈" v-model="editVisible" width="30%">
			<el-form label-width="70px">

				<el-form-item label="回复内容">
					<el-input type="textarea" v-model="currentReply"
						:style="{ width: '300px', height: '100px' }"></el-input>
				</el-form-item>
			</el-form>
			<el-button @click="saveReply">保存</el-button>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="tabs">
import { ref, reactive } from 'vue';
import axios from 'axios';
import { ElMessageBox ,ElMessage} from 'element-plus';
interface Message {
	feedbackID: number;
	feedbackTitle: string;
	feedbackType: string;
	feedbackContent: string;
	replyContent?: string;
	feedbackSendTime: string;
	replyTime: string;
}

const editVisible = ref(false);
const message = ref('first');
const state = reactive({
	unread: [] as Message[],
	read: [] as Message[],
	recycle: [] as Message[]
});

// 获取数据
axios.get('http://42.192.39.198:5000/api/Feedback')
	.then(response => {
		state.unread = response.data.map(item => ({
			feedbackID: item.feedbackID,
			feedbackTitle: item.feedbackTitle,
			feedbackType: item.type,
			feedbackContent: item.feedbackContent,
			replyContent: item.replyContent,
			feedbackSendTime: item.feedbackSendTime
		}));
		// 对 state.read 和 state.recycle 数组进行类似处理
	})
	.catch(error => {
		console.log(error);
	});

let currentReplyIndex = -1;
const handleRead = (index: number) => {
  const item = state.unread.splice(index, 1);
  state.read = item.concat(state.read);
};

const handleReply = (index: number) => {
	if (!editVisible.value) {
		editVisible.value = true;
		currentReply.value = state.unread[index].replyContent || '';
		currentReplyIndex = index;
	} else {
		editVisible.value = false;
	}
}


const handleView = (index: number) => {
    ElMessageBox.alert(state.unread[index].feedbackContent, '反馈内容');
}

const handleDel = (index: number) => {
	const item = state.read.splice(index, 1);
	state.recycle = item.concat(state.recycle);
};
const handleRestore = (index: number) => {
	const item = state.recycle.splice(index, 1);
	state.read = item.concat(state.read);
};

const showReplyBox = ref(false);
const currentReply = ref('');
const saveReply = () => {
	if (currentReplyIndex >= 0) {
		state.unread[currentReplyIndex].replyContent = currentReply.value;
		editVisible.value = false;
		currentReply.value = '';
		
		// 更新服务器上的数据
		const feedbackID = state.unread[currentReplyIndex].feedbackID;
		const replyContent = state.unread[currentReplyIndex].replyContent;
		axios.put(`http://42.192.39.198:5000/api/Feedback/${feedbackID}`, {
			replyContent: replyContent
		})
		.then(response => {
			console.log(response.data);
			ElMessage.success('回复已保存');
		})
		.catch(error => {
			console.log(error);
			ElMessage.error('保存失败');
		});
		
		currentReplyIndex = -1;
	}
}


const query = reactive({
	designIdea: '',
	productName: '',
	pageIndex: 1,
	pageSize: 10
});

</script>

<style>
.message-feedbackTitle {
	cursor: pointer;
}

.handle-row {
	margin-top: 30px;
}
</style>