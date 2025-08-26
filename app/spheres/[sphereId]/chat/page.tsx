import ChatPage from "./ChatPage"

export default async function Page({ params }: { params: Promise<{ sphereId: string }> }) {
  const { sphereId } = await params
  // Server component that passes the dynamic param to the client ChatPage
  return <ChatPage sphereId={sphereId} />
}
