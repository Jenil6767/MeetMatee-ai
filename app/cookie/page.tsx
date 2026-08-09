import React from 'react'
import LegalPageLayout, { LegalPageData } from '../components/legal/LegalPageLayout'
import legalContent from '../data/legalContent.json'

export default function CookiePolicyPage() {
  const data = legalContent['cookie'] as LegalPageData

  return <LegalPageLayout data={data} />
}
