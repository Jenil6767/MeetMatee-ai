'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React, { useState } from 'react'

interface SetupFormProps {
  platform: string
  data: any
  onSubmit: (platform: string, config: any) => void
  onCancel: () => void
  loading: boolean
}

function SetupForm({
  platform,
  data,
  onSubmit,
  onCancel,
  loading,
}: SetupFormProps) {
  const [selectedId, setSelectedId] = useState('')
  const [selectedName, setSelectedName] = useState('')
  const [createNew, setCreateNew] = useState(false)
  const [newName, setNewName] = useState('')

  const items =
    platform === 'trello'
      ? data?.boards
      : platform === 'slack'
      ? data?.channels
      : data?.projects

  const itemLabel =
    platform === 'trello'
      ? 'board'
      : platform === 'slack'
      ? 'channel'
      : 'project'

  const handleSubmit = () => {
    if (createNew) {
      onSubmit(platform, {
        createNew: true,
        [`${itemLabel}Name`]: newName,
        workspaceId: data?.workspaceId,
      })
    } else {
      onSubmit(platform, {
        [`${itemLabel}Id`]: selectedId,
        [`${itemLabel}Name`]: selectedName,
        projectKey: selectedId,
        workspaceId: data?.workspaceId,
      })
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <Label className="block text-xs font-medium uppercase tracking-wider text-[#5A5A5A] mb-2">
          Select {itemLabel} for action items:
        </Label>

        {!createNew ? (
          <Select
            value={selectedId}
            onValueChange={(value) => {
              const selected = items?.find(
                (item: any) =>
                  item.id === value || item.key === value || item.gid === value
              )
              setSelectedId(value)
              setSelectedName(selected?.name || '')
            }}
          >
            <SelectTrigger className="w-full h-[48px] rounded-[14px] border-black/[0.12] bg-[#F8F6F1] text-sm font-medium focus:ring-2 focus:ring-[#FF5A0A]">
              <SelectValue placeholder={`Choose existing ${itemLabel}...`} />
            </SelectTrigger>
            <SelectContent className="rounded-[16px] border border-black/[0.08] shadow-lg">
              <SelectGroup>
                <SelectLabel className="text-xs text-[#808080]">
                  {itemLabel.charAt(0).toUpperCase() + itemLabel.slice(1)}s
                </SelectLabel>
                {items?.map((item: any) => (
                  <SelectItem
                    key={item.id || item.key || item.gid}
                    value={item.id || item.key || item.gid}
                    className="text-sm cursor-pointer"
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : (
          <Input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={`Enter new ${itemLabel} name...`}
            className="w-full h-[48px] rounded-[14px] border-black/[0.12] bg-[#F8F6F1] text-sm focus:ring-2 focus:ring-[#FF5A0A]"
          />
        )}
      </div>

      <div className="flex items-center gap-2 text-sm pt-1">
        <Checkbox
          id="create-new"
          checked={createNew}
          onCheckedChange={(checked) => setCreateNew(!!checked)}
          className="cursor-pointer"
        />
        <Label
          htmlFor="create-new"
          className="text-sm font-medium text-[#111111] cursor-pointer"
        >
          Create new {itemLabel}
        </Label>
      </div>

      <div className="flex gap-3 pt-3">
        <button
          onClick={onCancel}
          type="button"
          className="flex-1 h-[48px] bg-white border border-black/[0.12] hover:bg-[#F8F6F1] text-[#111111] font-semibold text-sm rounded-[14px] transition-all cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading || (!createNew && !selectedId) || (createNew && !newName)}
          type="button"
          className="flex-1 h-[48px] bg-[#0F0F10] hover:bg-black text-white font-semibold text-sm rounded-[14px] transition-all disabled:opacity-50 cursor-pointer shadow-xs"
        >
          {loading ? 'Saving...' : 'Save Config'}
        </button>
      </div>
    </div>
  )
}

export default SetupForm
