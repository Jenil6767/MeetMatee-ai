'use client'

import React from 'react'
import { ActionItem, useActionItems } from '../../hooks/useActionItems'
import ActionItemsList from './ActionItemsList'
import AddActionItemInput from './AddActionItemInput'
import { toast } from 'sonner'

export interface ActionItemsProps {
  actionItems: ActionItem[]
  onDeleteItem: (id: number) => void
  onAddItem: (text: string) => void
  meetingId: string
}

function ActionItems({
  actionItems,
  onDeleteItem,
  onAddItem,
  meetingId,
}: ActionItemsProps) {
  const {
    integrations,
    integrationsLoaded,
    loading,
    setLoading,
    showAddInput,
    setShowAddInput,
    newItemText,
    setNewItemText,
  } = useActionItems(meetingId)

  const addToIntegration = async (platform: string, actionItem: ActionItem) => {
    setLoading((prev) => ({ ...prev, [`${platform}-${actionItem.id}`]: true }))
    try {
      const response = await fetch('/api/integrations/action-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          actionItem: actionItem.text,
          meetingId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Action item added to ${platform}!`)
      } else {
        toast.error(data.error || `Failed to add action item to ${platform}`)
      }
    } catch (error) {
      console.error(`Failed to add action item to ${platform}:`, error)
      toast.error(`Failed to add action item to ${platform}`)
    } finally {
      setLoading((prev) => ({ ...prev, [`${platform}-${actionItem.id}`]: false }))
    }
  }


  const handleAddNewItem = async () => {
    if (!newItemText.trim()) return

    try {
      toast(`✅ Action item added`, {
        action: {
          label: 'OK',
          onClick: () => {},
        },
      })
      const response = await fetch(`/api/meetings/${meetingId}/action-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newItemText,
        }),
      })

      if (response.ok) {
        onAddItem(newItemText)
        setNewItemText('')
        setShowAddInput(false)
      }
    } catch (error) {
      console.error('Failed to add action item:', error)
    }
  }

  const handleDeleteItem = async (id: number) => {
    try {
      toast(`✅ Action item deleted`, {
        action: {
          label: 'OK',
          onClick: () => {},
        },
      })
      const response = await fetch(`/api/meetings/${meetingId}/action-items/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onDeleteItem(id)
      }
    } catch (error) {
      console.error('Failed to delete action item:', error)
    }
  }

  const hasConnectedIntegrations = integrations.length > 0

  if (!integrationsLoaded) {
    return (
      <div className="bg-white rounded-[24px] p-8 border border-black/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.06)] mb-8">
        <h3 className="text-lg font-bold text-[#111111] mb-5 tracking-tight">
          Action Items
        </h3>

        <div className="space-y-4">
          {actionItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <p className="flex-1 text-sm font-medium text-[#111111]">
                {item.text}
              </p>
              <div className="animate-pulse">
                <div className="h-6 w-20 bg-[#F4EFE5] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[24px] p-8 border border-black/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.06)] mb-8">
      <h3 className="text-lg font-bold text-[#111111] mb-5 tracking-tight">
        Action Items
      </h3>

      <ActionItemsList
        actionItems={actionItems}
        integrations={integrations}
        loading={loading}
        addToIntegration={addToIntegration}
        handleDeleteItem={handleDeleteItem}
      />

      <AddActionItemInput
        showAddInput={showAddInput}
        setShowAddInput={setShowAddInput}
        newItemText={newItemText}
        setNewItemText={setNewItemText}
        onAddItem={handleAddNewItem}
      />

      {!hasConnectedIntegrations && actionItems.length > 0 && (
        <div className="mt-5 p-3.5 bg-[#F8F6F1] rounded-[16px] border border-dashed border-black/[0.12]">
          <p className="text-xs text-[#5A5A5A] text-center font-medium">
            <a href="/integrations" className="text-[#FF5A0A] font-bold hover:underline">
              Connect Integrations
            </a>{' '}
            to add action items directly to Slack, Trello, Jira or Asana
          </p>
        </div>
      )}
    </div>
  )
}

export default ActionItems
