'use client'

import React from 'react'
import { Integration } from '../../hooks/useActionItems'
import { ChevronDown, ExternalLink, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ActionItemRowProps {
  item: {
    id: number
    text: string
  }
  integrations: Integration[]
  loading: { [key: string]: boolean }
  addToIntegration: (platform: string, item: { id: number; text: string }) => void
  handleDeleteItem: (id: number) => void
}

function ActionItemRow({
  item,
  integrations,
  loading,
  addToIntegration,
  handleDeleteItem,
}: ActionItemRowProps) {
  const hasConnectedIntegrations = integrations.length > 0

  return (
    <div className="group relative py-1">
      <div className="flex items-start gap-3.5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A0A] mt-2 shrink-0" />

        <p className="flex-1 text-sm font-medium text-[#111111] leading-relaxed">
          {item.text}
        </p>

        {hasConnectedIntegrations && (
          <div className="transition-opacity relative shrink-0">
            {integrations.length === 1 ? (
              <button
                onClick={() => addToIntegration(integrations[0].platform, item)}
                disabled={loading[`${integrations[0].platform}-${item.id}`]}
                type="button"
                className="h-[36px] px-3.5 bg-[#F8F6F1] hover:bg-[#FFF2EA] text-[#111111] hover:text-[#FF5A0A] border border-black/[0.08] text-xs font-semibold rounded-[12px] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {loading[`${integrations[0].platform}-${item.id}`] ? (
                  'Adding...'
                ) : (
                  <>
                    <span>Add to {integrations[0].name}</span>
                    <ExternalLink className="h-3 w-3" />
                  </>
                )}
              </button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="h-[36px] px-3.5 bg-[#F8F6F1] hover:bg-[#FFF2EA] text-[#111111] hover:text-[#FF5A0A] border border-black/[0.08] text-xs font-semibold rounded-[12px] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Add to</span>
                    <ChevronDown className="h-3 w-3 text-[#5A5A5A]" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="min-w-[170px] rounded-[16px] border border-black/[0.08] p-1.5 shadow-lg bg-white"
                >
                  {integrations.map((integration) => (
                    <DropdownMenuItem
                      key={integration.platform}
                      onClick={() => addToIntegration(integration.platform, item)}
                      className="flex items-center gap-2.5 p-2 rounded-[10px] text-xs font-semibold text-[#111111] hover:bg-[#FFF2EA] hover:text-[#FF5A0A] cursor-pointer"
                    >
                      <div className="w-4 h-4 relative shrink-0">
                        <img
                          src={integration.logo}
                          alt={integration.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>

                      <span>
                        {loading[`${integration.platform}-${item.id}`]
                          ? 'Adding...'
                          : `Add to ${integration.name}`}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}

        <button
          onClick={() => handleDeleteItem(item.id)}
          type="button"
          className="opacity-0 group-hover:opacity-100 p-1.5 text-[#808080] hover:text-[#E5484D] hover:bg-[#E5484D]/10 rounded-[8px] transition-all cursor-pointer shrink-0"
          title="Delete action item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default ActionItemRow
