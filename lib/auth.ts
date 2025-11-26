import { betterAuth } from "better-auth"
import { emailOTP } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { Resend } from "resend"
import prisma from "./prisma"

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: true
  },
  emailVerification: {
    autoSignInAfterVerification: true
  },
  plugins: [
    emailOTP({
      expiresIn: 600,
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`� Sending OTP to ${email}, type: ${type}, code: ${otp}`)

        if (type === "forget-password") {
          // 密码重置验证码
          const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: email,
            subject: "密码重置验证码 - LinguoFlow",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #4F46E5; margin-bottom: 20px;">密码重置验证码</h2>
                <p style="color: #374151; margin-bottom: 20px;">您好,</p>
                <p style="color: #374151; margin-bottom: 30px;">您的密码重置验证码是:</p>
                <div style="text-align: center; margin: 40px 0;">
                  <div style="background-color: #F3F4F6; padding: 24px; border-radius: 12px; display: inline-block;">
                    <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #4F46E5; font-family: 'Courier New', monospace;">${otp}</span>
                  </div>
                </div>
                <p style="color: #6B7280; font-size: 14px; margin-bottom: 10px;">⏱️ 此验证码将在 <strong>10 分钟</strong>后失效。</p>
                <p style="color: #6B7280; font-size: 14px; margin-bottom: 30px;">🔒 如果您没有请求重置密码,请忽略此邮件。</p>
                <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;" />
                <p style="color: #9CA3AF; font-size: 12px; text-align: center;">LinguoFlow - 您的语言学习伙伴</p>
              </div>
            `,
          })
          console.log("🚀 ~ data, error:", data, error)
        } else if (type === "email-verification") {
          // 邮箱验证码
          await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: email,
            subject: "邮箱验证码 - LinguoFlow",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #4F46E5; margin-bottom: 20px;">欢迎加入 LinguoFlow!</h2>
                <p style="color: #374151; margin-bottom: 20px;">您好,</p>
                <p style="color: #374151; margin-bottom: 30px;">感谢您注册 LinguoFlow。您的邮箱验证码是:</p>
                <div style="text-align: center; margin: 40px 0;">
                  <div style="background-color: #F3F4F6; padding: 24px; border-radius: 12px; display: inline-block;">
                    <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #4F46E5; font-family: 'Courier New', monospace;">${otp}</span>
                  </div>
                </div>
                <p style="color: #6B7280; font-size: 14px; margin-bottom: 10px;">⏱️ 此验证码将在 <strong>10 分钟</strong>后失效。</p>
                <p style="color: #374151; margin-bottom: 30px;">验证后,您就可以开始您的语言学习之旅了!</p>
                <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;" />
                <p style="color: #9CA3AF; font-size: 12px; text-align: center;">LinguoFlow - 您的语言学习伙伴</p>
              </div>
            `,
          })
        } else if (type === "sign-in") {
          // 登录验证码
          await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: email,
            subject: "登录验证码 - LinguoFlow",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #4F46E5; margin-bottom: 20px;">登录验证码</h2>
                <p style="color: #374151; margin-bottom: 20px;">您好,</p>
                <p style="color: #374151; margin-bottom: 30px;">您的登录验证码是:</p>
                <div style="text-align: center; margin: 40px 0;">
                  <div style="background-color: #F3F4F6; padding: 24px; border-radius: 12px; display: inline-block;">
                    <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #4F46E5; font-family: 'Courier New', monospace;">${otp}</span>
                  </div>
                </div>
                <p style="color: #6B7280; font-size: 14px; margin-bottom: 10px;">⏱️ 此验证码将在 <strong>10 分钟</strong>后失效。</p>
                <p style="color: #6B7280; font-size: 14px; margin-bottom: 30px;">🔒 如果这不是您的操作,请忽略此邮件。</p>
                <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;" />
                <p style="color: #9CA3AF; font-size: 12px; text-align: center;">LinguoFlow - 您的语言学习伙伴</p>
              </div>
            `,
          })
        }
      },
    }),
  ],
})

console.log("✅ Better Auth with Email OTP initialized successfully")
