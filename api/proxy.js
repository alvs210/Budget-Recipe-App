export default async function handler(req, res) {
    const params = { ...req.query }
    const path = params.path
    delete params.path

    if (!path) return res.status(400).json({ error: 'Missing path param' })

    params.apiKey = process.env.SPOONACULAR_KEY

    const qs = new URLSearchParams(params).toString()
    const url = `https://api.spoonacular.com/${path}?${qs}`

    try {
        const response = await fetch(url)
        const contentType = response.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
            res.status(response.status).json(await response.json())
        } else {
            res.status(response.status).send(await response.text())
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}