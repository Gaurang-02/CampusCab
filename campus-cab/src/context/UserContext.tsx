'use client'
import React, { createContext, useState, ReactNode } from 'react'

type FullName = {
  firstName: string
  lastName: string
}

type User = {
  _id: any
  email: string
  fullName: FullName
}

type UserContextType = {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
}

export const UserDataContext = createContext<UserContextType | undefined>(undefined)

const UserContext = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
    email: '',
    fullName: {
      firstName: '',
      lastName: '',
    },
  })

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  )
}

export default UserContext
