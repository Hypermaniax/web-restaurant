import { useState } from 'react'
import type { ModifierGroup, ModifierOption } from '../api/types'

export function useModifierDialogs() {
  const [groupOpen, setGroupOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<ModifierGroup | null>(null)
  const [optionOpen, setOptionOpen] = useState(false)
  const [editingOption, setEditingOption] = useState<ModifierOption | null>(
    null,
  )
  const [optionGroup, setOptionGroup] = useState<ModifierGroup | null>(null)
  const [deletingGroup, setDeletingGroup] = useState<ModifierGroup | null>(null)
  const [deletingOption, setDeletingOption] = useState<ModifierOption | null>(
    null,
  )

  function openCreateGroup() {
    setEditingGroup(null)
    setGroupOpen(true)
  }

  function openEditGroup(group: ModifierGroup) {
    setEditingGroup(group)
    setGroupOpen(true)
  }

  function openCreateOption(group: ModifierGroup) {
    setOptionGroup(group)
    setEditingOption(null)
    setOptionOpen(true)
  }

  function openEditOption(group: ModifierGroup, option: ModifierOption) {
    setOptionGroup(group)
    setEditingOption(option)
    setOptionOpen(true)
  }

  return {
    groupOpen,
    setGroupOpen,
    editingGroup,
    optionOpen,
    setOptionOpen,
    editingOption,
    optionGroup,
    deletingGroup,
    setDeletingGroup,
    deletingOption,
    setDeletingOption,
    openCreateGroup,
    openEditGroup,
    openCreateOption,
    openEditOption,
  }
}
