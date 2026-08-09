import React from 'react'
import LegalPageLayout, { LegalPageData } from '../components/legal/LegalPageLayout'
import legalContent from '../data/legalContent.json'

export default function TermsPage() {
  const data = legalContent['terms'] as LegalPageData

  return <LegalPageLayout data={data} />
}
