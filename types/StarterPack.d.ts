interface StarterPack extends Instance {
	WhiteKey: Tool & {
        Handle: Part;
		WhiteKey: Model & {
			KeyPart: MeshPart;
			Handle: BasePart;
			Scripts: Folder & {
				whiteKey: LocalScript
			}
		};
	};
}
