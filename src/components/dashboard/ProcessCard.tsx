"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { startProcess } from "@/client-api/api"

export function ProcessCard() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  async function handleProcess() {
    setLoading(true)
    try {
      const data = await startProcess()
      setResult(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Process Control</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleProcess}
          disabled={loading}
        >
          {loading ? "Processing..." : "Start Process"}
        </Button>
        {result && (
          <pre className="mt-4 p-4 bg-muted rounded-md">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  )
}