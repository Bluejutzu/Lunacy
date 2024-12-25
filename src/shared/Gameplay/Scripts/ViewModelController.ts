import { Constants } from "../Constants"

export const ViewModelController = (n: Tool) => {
    const tool = n
    const viewModelName = tool.GetAttribute(Constants.VIEWMODEL_ATTRIBUTE) as string
}