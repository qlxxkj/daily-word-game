"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/../lib/supabaseClient"

export default function Home() {
    const [todayWord, setTodayWord] = useState("")
    const [guess, setGuess] = useState("")
    const [message, setMessage] = useState("")
    const [finished, setFinished] = useState(false)

    useEffect(() => {
        const fetchTodayWord = async () => {
            const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
            const { data } = await supabase
                .from("games")
                .select("answer")
                .eq("game_date", today)
                .single()
            if (data) setTodayWord(data.answer)
        }
        fetchTodayWord()
    }, [])

    const checkGuess = async () => {
        if (!guess) return
        if (guess.toLowerCase() === todayWord.toLowerCase()) {
            setMessage("🎉 恭喜答对！")
            setFinished(true)
        } else {
            setMessage("❌ 再试一次！")
        }

        // 存入数据库（简单示例，默认 user_id = 1）
        await supabase.from("attempts").insert([
            { user_id: "anonymous", game_id: 1, guess, is_correct: guess === todayWord }
        ])
    }

    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-6">每日猜词游戏</h1>

            {!finished ? (
                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        className="border p-2 rounded"
                        placeholder="输入你的答案"
                    />
                    <button
                        onClick={checkGuess}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        提交
                    </button>
                </div>
            ) : (
                <button
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                        navigator.clipboard.writeText(`我今天猜中了每日单词！💡`)
                        alert("结果已复制，可以去 Reddit/Twitter 分享啦！")
                    }}
                >
                    分享成绩
                </button>
            )}

            <p className="mt-4">{message}</p>
        </main>
    )
}
