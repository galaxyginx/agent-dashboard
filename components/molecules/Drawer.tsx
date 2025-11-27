import { ViewProps } from "@/types";

export function Drawer({ masterData, t }: ViewProps) {
    return <div className="flex flex-col justify-between bg-gray-800 w-[15%] h-full">
        <h1 className="text-4xl p-4">GalaxyX</h1>
        <div className="flex-1">
            <h1 className="p-4">Conversations</h1>
            <div>
                <p className="p-4">Conversation 1</p>
                <p className="p-4">Conversation 2</p>
                <p className="p-4">Conversation 3</p>
            </div>
        </div>
        <div className="bg-gray-700">
            {/* <h1>{masterData.myProfile?.name}</h1>
            <div>
                <p>{masterData.myProfile?.plan}</p>
            </div> */}
        </div>
    </div>
}