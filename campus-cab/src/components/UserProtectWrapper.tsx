'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  children: React.ReactNode
}

const UserProtectWrapper: React.FC<Props> = ({ children }) => {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  return <>{children}</>
}

export default UserProtectWrapper
