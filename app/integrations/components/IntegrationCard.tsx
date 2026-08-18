'use client'

import React from 'react'
import { Integration } from '../hooks/useIntegrations'
import Image from 'next/image'
import { Check, ExternalLink, Settings } from 'lucide-react'

interface IntegrationCardProps {
  integration: Integration
  onConnect: (platform: string) => void
  onDisconnect: (platform: string) => void
  onSetup: (platform: string) => void
  isFreePlan: boolean
}

function IntegrationCard({
  integration,
  onConnect,
  onDisconnect,
  onSetup,
  isFreePlan,
}: IntegrationCardProps) {
  return (
    <div className="bg-white rounded-[24px] border border-black/[0.08] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:-translate-y-[6px] hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-[16px] bg-[#FFF2EA] p-2.5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <div className="w-full h-full relative">
                <Image
                  src={integration.logo}
                  alt={`${integration.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#111111] tracking-[-0.02em]">
                {integration.name}
              </h3>
              {integration.connected && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#18A957]/10 text-[#18A957] px-2.5 py-0.5 rounded-full border border-[#18A957]/20 mt-1">
                  <Check className="w-3 h-3 stroke-[3]" />
                  Connected
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-[#5A5A5A] mb-5 font-normal tracking-[-0.01em] leading-[1.6]">
          {integration.description}
        </p>

        {integration.connected &&
          integration.platform !== 'google-calendar' &&
          (integration.boardName || integration.projectName || integration.channelName) && (
            <div className="mb-5 p-3.5 bg-[#F8F6F1] rounded-[16px] border border-black/[0.06]">
              <div className="text-[11px] font-semibold text-[#808080] uppercase tracking-wider mb-0.5">
                Destination:
              </div>
              <div className="text-xs font-bold text-[#111111]">
                {integration.platform === 'slack' &&
                  integration.channelName &&
                  `#${integration.channelName}`}
                {integration.platform === 'trello' && integration.boardName}
                {integration.platform === 'jira' && integration.projectName}
                {integration.platform === 'asana' && integration.projectName}
              </div>
            </div>
          )}

        {integration.connected && integration.platform === 'google-calendar' && (
          <div className="mb-5 p-3.5 bg-[#F8F6F1] rounded-[16px] border border-black/[0.06]">
            <div className="text-[11px] font-semibold text-[#808080] uppercase tracking-wider mb-0.5">
              Status:
            </div>
            <div className="text-xs font-bold text-[#111111]">
              Lambda auto-sync enabled
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2.5 pt-2">
        {integration.connected ? (
          integration.platform === 'google-calendar' ? (
            <button
              onClick={() => onDisconnect(integration.platform)}
              type="button"
              className="flex-1 h-[42px] bg-white border border-black/[0.12] hover:bg-[#F8F6F1] text-[#111111] text-xs font-semibold rounded-[12px] transition-all cursor-pointer"
            >
              Disconnect
            </button>
          ) : (
            <>
              <button
                onClick={() => onDisconnect(integration.platform)}
                type="button"
                className="flex-1 h-[42px] bg-white border border-black/[0.12] hover:bg-[#F8F6F1] text-[#111111] text-xs font-semibold rounded-[12px] transition-all cursor-pointer"
              >
                Disconnect
              </button>
              <button
                onClick={() => onSetup(integration.platform)}
                type="button"
                className="w-[42px] h-[42px] bg-[#F8F6F1] hover:bg-[#FFF2EA] text-[#5A5A5A] hover:text-[#FF5A0A] border border-black/[0.08] rounded-[12px] flex items-center justify-center transition-all cursor-pointer"
                title="Configure destination"
              >
                <Settings className="h-4 w-4" />
              </button>
            </>
          )
        ) : (
          /* Free plan: disabled button with tooltip */
          isFreePlan ? (
            <div className="relative w-full group/tooltip">
              <button
                type="button"
                disabled
                className="w-full h-[42px] bg-[#F4EFE5] text-[#AAAAAA] text-xs font-semibold rounded-[12px] flex items-center justify-center gap-2 cursor-not-allowed border border-black/[0.06] select-none"
              >
                <span>Connect</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover/tooltip:flex items-center whitespace-nowrap bg-[#0F0F10] text-white text-[11px] font-medium px-3 py-1.5 rounded-[10px] shadow-lg z-20 pointer-events-none gap-1.5">
                <span>🔒</span>
                <span>Upgrade your plan to access this integration</span>
                {/* Arrow */}
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0F0F10]" />
              </div>
            </div>
          ) : (
            <button
              onClick={() => onConnect(integration.platform)}
              type="button"
              className="w-full h-[42px] bg-[#0F0F10] hover:bg-black text-white text-xs font-semibold rounded-[12px] flex items-center justify-center gap-2 transition-all hover:scale-[1.01] shadow-xs cursor-pointer"
            >
              <span>Connect</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          )
        )}
      </div>
    </div>
  )
}

export default IntegrationCard
