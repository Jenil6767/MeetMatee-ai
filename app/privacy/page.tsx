import React from 'react'
import LegalPageLayout, { LegalPageData } from '../components/legal/LegalPageLayout'
import legalContent from '../data/legalContent.json'

export default function PrivacyPage() {
  const data = legalContent['privacy-policy'] as LegalPageData

  return <LegalPageLayout data={data} />
}
