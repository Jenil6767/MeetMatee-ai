import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export default function Page() {
  return (
    <div className="w-full flex flex-col">
      <SignIn
        afterSignInUrl="/"
        localization={{
          signIn: {
            start: {
              title: 'Sign in to MeetMatee',
            },
          },
        }}
        appearance={{
          layout: {
            logoImageUrl: '/meetMatee.png',
            logoPlacement: 'inside',
          },
          variables: {
            colorPrimary: '#FF5A0A',
            colorBackground: '#ffffff',
            colorText: '#111111',
            colorTextSecondary: '#555555',
            colorInputBackground: '#F5F5F5',
            colorInputText: '#111111',
            colorDanger: '#EF4444',
            borderRadius: '12px',
            fontFamily: 'inherit',
          },
          elements: {
            rootBox: 'w-full',
            card: [
              'w-full !shadow-[0_16px_48px_rgba(0,0,0,0.08)]',
              '!rounded-[20px] !bg-white',
              '!border !border-[rgba(0,0,0,0.06)]',
              '!p-5 sm:!p-6',
            ].join(' '),
            logoBox: '!flex !justify-center !items-center !mb-2 !mx-auto',
            logoImage: '!h-7 sm:!h-[30px] !w-auto !object-contain',
            header: '!text-center !mb-2.5 !mt-0',
            headerTitle: '!text-[19px] !font-bold !tracking-[-0.025em] !text-[#111111] !leading-tight !text-center',
            headerSubtitle: '!hidden',
            main: '!gap-2.5',
            socialButtons: '!gap-2',
            socialButtonsBlockButton: [
              '!h-[42px] !rounded-[11px]',
              '!bg-white !border !border-[rgba(0,0,0,0.09)]',
              '!text-[#111] !font-semibold !text-[13px]',
              'hover:!shadow-sm hover:!-translate-y-[0.5px]',
              '!transition-all !duration-200',
            ].join(' '),
            socialButtonsBlockButtonText: '!font-semibold !text-[13px]',
            socialButtonsProviderIcon: '!w-4 !h-4',
            dividerRow: '!my-1.5',
            dividerLine: '!bg-[rgba(0,0,0,0.08)]',
            dividerText: '!text-[#999] !text-[11.5px] !font-normal !px-2',
            form: '!gap-2.5',
            formField: '!mb-2',
            formFieldLabel: '!text-[12px] !font-medium !text-[#333] !tracking-[-0.01em] !mb-1',
            formFieldInput: [
              '!h-[42px] !rounded-[11px]',
              '!border !border-[rgba(0,0,0,0.1)]',
              '!bg-[#F5F5F5] !text-[13px] !text-[#111]',
              'focus:!border-[#FF5A0A] focus:!ring-2 focus:!ring-[rgba(255,90,10,0.1)]',
              '!transition-all !duration-200',
            ].join(' '),
            formFieldInputShowPasswordButton: '!text-[#888] hover:!text-[#FF5A0A]',
            formButtonPrimary: [
              '!h-[42px] !rounded-[11px]',
              '!bg-[#FF5A0A] hover:!bg-[#e04800]',
              '!text-white !font-semibold !text-[13.5px]',
              '!transition-all !duration-200',
              'hover:!-translate-y-[0.5px] hover:!shadow-md hover:!shadow-[rgba(255,90,10,0.2)] !mt-1',
            ].join(' '),
            footer: '!mt-1.5 !pt-0',
            footerActionLink: '!text-[12px] !text-[#FF5A0A] !font-semibold hover:!text-[#e04800]',
            footerActionText: '!text-[12px] !text-[#666]',
            otpCodeFieldInput: [
              '!h-[42px] !rounded-[10px]',
              '!border !border-[rgba(0,0,0,0.1)] !bg-[#F5F5F5]',
              '!text-[#111] !font-semibold',
              'focus:!border-[#FF5A0A] focus:!ring-2 focus:!ring-[rgba(255,90,10,0.1)]',
            ].join(' '),
            alert: '!rounded-[10px]',
            alertText: '!text-[12px]',
            identityPreviewEditButton: '!text-[#FF5A0A]',
            identityPreviewText: '!text-[13px] !text-[#333]',
          },
        }}
      />

      {/* Security + Terms below card */}
      {/* <div className="mt-3.5 flex flex-col items-center gap-1">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#bbb]" aria-hidden="true" />
          <span className="text-[11px] text-[#aaa] font-normal">
            Secured by Clerk · Your data is safe with us
          </span>
        </div>
        <p className="text-[11px] text-[#bbb] font-normal text-center">
          By continuing you agree to our{' '}
          <Link href="/terms" className="text-[#FF5A0A] hover:underline font-medium">
            Terms
          </Link>{' '}
          &amp;{' '}
          <Link href="/privacy-policy" className="text-[#FF5A0A] hover:underline font-medium">
            Privacy Policy
          </Link>
        </p>
      </div> */}
    </div>
  )
}