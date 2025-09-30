// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// 不要直接在顶层创建和导出客户端实例
// export const supabase = createClient(...) // ❌ 错误方式

// 改为导出一个创建客户端的函数
export const createSupabaseClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase environment variables are not set')
    }

    return createClient(supabaseUrl, supabaseAnonKey)
}