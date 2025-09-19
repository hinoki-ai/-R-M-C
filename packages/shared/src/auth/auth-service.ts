import { z } from 'zod'

// Auth schemas
export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

export const RegisterSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
})

export const ResetPasswordSchema = z.object({
  email: z.string().email('Email inválido')
})

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Contraseña actual requerida'),
  newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
  confirmNewPassword: z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmNewPassword"]
})

// Auth service class
export class AuthService {
  private static instance: AuthService

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async login(credentials: z.infer<typeof LoginSchema>) {
    const validatedCredentials = LoginSchema.parse(credentials)

    // TODO: Implement real authentication with backend API
    throw new Error('Authentication service not implemented - use real backend')
  }

  async register(userData: z.infer<typeof RegisterSchema>) {
    const validatedData = RegisterSchema.parse(userData)

    // TODO: Implement real user registration with backend API
    throw new Error('User registration not implemented - use real backend')
  }

  async logout() {
    // Clear local storage, cookies, etc.
    return { success: true }
  }

  async resetPassword(email: string) {
    const validatedEmail = ResetPasswordSchema.parse({ email })

    // Send password reset email to user
    return {
      success: true,
      message: 'Se ha enviado un email de recuperación'
    }
  }

  async changePassword(passwordData: z.infer<typeof ChangePasswordSchema>) {
    const validatedData = ChangePasswordSchema.parse(passwordData)

    // Change user password with validation
    return {
      success: true,
      message: 'Contraseña cambiada exitosamente'
    }
  }

  async getCurrentUser() {
    // TODO: Implement real user fetching from backend API
    throw new Error('Get current user not implemented - use real backend')
  }

  async refreshToken() {
    // TODO: Implement real token refresh with backend API
    throw new Error('Token refresh not implemented - use real backend')
  }
}