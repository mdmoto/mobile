<template>
  <view class="wrapper">
    <view>
      <h4>{{ $t('distribution.identityAuth') }}（{{ $t('distribution.realInfoTips') }}）</h4>
      <view>
        <u-form :model="ruleForm" label-width="200rpx" ref="uForm">
          <u-form-item :label="$t('distribution.realName')" prop="name">
            <u-input v-model="ruleForm.name" :placeholder="$t('distribution.inputRealName')" />
          </u-form-item>
          <u-form-item :label="$t('distribution.idNumber')" prop="idNumber">
            <u-input v-model="ruleForm.idNumber" :placeholder="$t('distribution.inputIdNumber')" />
          </u-form-item>
          <u-form-item :label="$t('distribution.bankBranch')" prop="settlementBankBranchName">
            <u-input v-model="ruleForm.settlementBankBranchName" type="text" :placeholder="$t('distribution.inputBankBranch')" />
          </u-form-item>
          <u-form-item :label="$t('distribution.bankAccountName')" prop="settlementBankAccountName">
            <u-input v-model="ruleForm.settlementBankAccountName" type="text" :placeholder="$t('distribution.inputBankAccountName')" />
          </u-form-item>
          <u-form-item :label="$t('distribution.bankAccountNumber')" prop="settlementBankAccountNum">
            <u-input v-model="ruleForm.settlementBankAccountNum" type="text" :placeholder="$t('distribution.inputBankAccountNumber')" />
          </u-form-item>
          <!-- <u-form-item label="身份证正面照" prop="name">
            <u-upload></u-upload>
          </u-form-item>
          <u-form-item label="身份证反面照" prop="name">
            <u-upload></u-upload>
          </u-form-item>
          <u-form-item label="手持身份证照" prop="name">
            <u-upload></u-upload>
          </u-form-item> -->
        </u-form>
        <u-button :customStyle="{'background':$lightColor,'color':'#fff' }" @click="submit">{{ $t('distribution.submitAuth') }}</u-button>
      </view>
    </view>

    <view class="tips">
      <view>{{ $t('distribution.auditStatusTips') }}</view>
      <view>{{ $t('distribution.auditTimeTips') }}</view>
    </view>
  </view>
</template>
<script>
import { applyDistribution } from "@/api/goods";
import { checkBankno } from "@/utils/Foundation";
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        idNumber: "",
        settlementBankBranchName: "", // 银行开户行
        settlementBankAccountName: "", //银行开户名
        settlementBankAccountNum: "", //银行账号
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t("distribution.inputRealName"),
            // 可以单个或者同时写两个触发验证方式
            trigger: "blur",
          },
          {
            // 自定义验证函数，见上说明
            validator: (rule, value, callback) => {
              // 上面有说，返回true表示校验通过，返回false表示不通过
              // uni.$u.test.mobile()就是返回true或者false的
              return uni.$u.test.chinese(value);
            },
            message: this.$t("distribution.invalidName"),
            // 触发器可以同时用blur和change
            trigger: ["change", "blur"],
          },
        ],
        // 银行开户行
        settlementBankBranchName: [
          {
            required: true,
            message: this.$t("distribution.bankBranch"),
            // 可以单个或者同时写两个触发验证方式
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              // 上面有说，返回true表示校验通过，返回false表示不通过
              // uni.$u.test.mobile()就是返回true或者false的
              return uni.$u.test.chinese(value);
            },
            message: this.$t("distribution.invalidBankBranch"),
            // 触发器可以同时用blur和change
            trigger: ["change", "blur"],
          },
        ], //银行开户名
        settlementBankAccountName: [
          {
            required: true,
            message: this.$t("distribution.bankAccountName"),
            // 可以单个或者同时写两个触发验证方式
            trigger: "blur",
          },
        ],
        //银行账号
        settlementBankAccountNum: [
          {
            required: true,
            message: this.$t("distribution.invalidBankAccountNumber"),
            // 可以单个或者同时写两个触发验证方式
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              // 上面有说，返回true表示校验通过，返回false表示不通过
              // uni.$u.test.mobile()就是返回true或者false的
              return checkBankno(value);
            },
            message: "银行账号不正确",
          },
        ],
        idNumber: [
          {
            required: true,
            message: this.$t("distribution.inputIdNumber"),
            // 可以单个或者同时写两个触发验证方式
            trigger: "blur",
          },
          {
            // 自定义验证函数，见上说明
            validator: (rule, value, callback) => {
              // 上面有说，返回true表示校验通过，返回false表示不通过
              // uni.$u.test.mobile()就是返回true或者false的
              return uni.$u.test.idCard(value);
            },
            message: this.$t("distribution.invalidIdNumber"),
            // 触发器可以同时用blur和change
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  methods: {
    submit() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          applyDistribution(this.ruleForm).then((res) => {
            if (res.data.success) {
              uni.showToast({
                title: this.$t("distribution.authSubmitSuccess"),
                duration: 2000,
                icon: "none",
              });

              setTimeout(() => {
                uni.navigateBack();
              }, 500);
            } else {
              uni.showToast({
                title: res.data.message,
                duration: 2000,
                icon: "none",
              });
            }
          });
        } else {
          uni.showToast({
            title: this.$t("distribution.inputValidInfo"),
            duration: 2000,
            icon: "none",
          });
        }
      });
    },
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  padding: 32rpx;
}
.tips {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: #999;
}
</style>