'use client'
import React, { useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const UserLogout = () => {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          localStorage.removeItem('token')
          router.push('/login')
        }
      })
      .catch(() => router.push('/login'))
  }, [router])

  return <div>Logging out...</div>
}

export default UserLogout
