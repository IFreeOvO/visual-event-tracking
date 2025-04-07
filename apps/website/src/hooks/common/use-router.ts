const useRouter = () => {
    const navigate = useNavigate()

    const router = useMemo(() => {
        return {
            back: () => navigate(-1),
            forward: () => navigate(1),
            reload: () => window.location.reload(),
            go: (delta: number) => navigate(delta),
            push: (href: string) => navigate(href, { replace: false }),
            replace: (href: string) => navigate(href, { replace: true }),
        }
    }, [navigate])

    return router
}

export default useRouter
