interface ReplicatedStorage extends Instance {
	Models: Folder & {
		NPC: Model & {
			LeftLowerArm: MeshPart & {
				LeftLowerArm: WrapTarget;
				OriginalSize: Vector3Value;
				LeftElbowRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				LeftElbow: Motor6D;
				LeftWristRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
			};
			LeftFoot: MeshPart & {
				LeftFoot: WrapTarget;
				LeftAnkle: Motor6D;
				OriginalSize: Vector3Value;
				LeftAnkleRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				LeftFootAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
			};
			AnimSaves: ObjectValue;
			RightHand: MeshPart & {
				RightGripAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				RightWristRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				RightWrist: Motor6D;
				OriginalSize: Vector3Value;
				RightHand: WrapTarget;
			};
			HumanoidRootPart: Part & {
				RootRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				OriginalSize: Vector3Value;
				RootAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
			};
			RightLowerLeg: MeshPart & {
				RightAnkleRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				RightKnee: Motor6D;
				RightKneeRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				RightLowerLeg: WrapTarget;
				OriginalSize: Vector3Value;
			};
			LeftUpperLeg: MeshPart & {
				LeftHipRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				LeftHip: Motor6D;
				OriginalSize: Vector3Value;
				LeftUpperLeg: WrapTarget;
				LeftKneeRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
			};
			LeftLowerLeg: MeshPart & {
				LeftKnee: Motor6D;
				OriginalSize: Vector3Value;
				LeftKneeRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				LeftAnkleRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				LeftLowerLeg: WrapTarget;
			};
			LowerTorso: MeshPart & {
				WaistCenterAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				LeftHipRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				Root: Motor6D;
				OriginalSize: Vector3Value;
				RootRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				RightHipRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				LowerTorso: WrapTarget;
				WaistRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				WaistBackAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				WaistFrontAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
			};
			Head: MeshPart & {
				HatAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				OriginalSize: Vector3Value;
				Head: WrapTarget;
				FaceFrontAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				face: Decal;
				HairAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				NeckRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				Neck: Motor6D;
				FaceCenterAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
			};
			UpperTorso: MeshPart & {
				LeftShoulderRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				BodyBackAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				NeckRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				UpperTorso: WrapTarget;
				OriginalSize: Vector3Value;
				Waist: Motor6D;
				RightCollarAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				RightShoulderRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				BodyFrontAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				WaistRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				LeftCollarAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				NeckAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
			};
			["Body Colors"]: BodyColors;
			LeftUpperArm: MeshPart & {
				LeftUpperArm: WrapTarget;
				LeftShoulder: Motor6D;
				LeftShoulderAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				LeftElbowRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				OriginalSize: Vector3Value;
				LeftShoulderRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
			};
			RightLowerArm: MeshPart & {
				RightLowerArm: WrapTarget;
				OriginalSize: Vector3Value;
				RightElbowRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				RightWristRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				RightElbow: Motor6D;
			};
			LeftHand: MeshPart & {
				LeftHand: WrapTarget;
				LeftWrist: Motor6D;
				LeftGripAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				OriginalSize: Vector3Value;
				LeftWristRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
			};
			Animate: LocalScript & {
				point: StringValue & {
					PointAnim: Animation;
				};
				climb: StringValue & {
					ClimbAnim: Animation;
				};
				cheer: StringValue & {
					CheerAnim: Animation;
				};
				dance3: StringValue & {
					Animation2: Animation & {
						Weight: NumberValue;
					};
					Animation3: Animation & {
						Weight: NumberValue;
					};
					Animation1: Animation & {
						Weight: NumberValue;
					};
				};
				toolnone: StringValue & {
					ToolNoneAnim: Animation;
				};
				dance: StringValue & {
					Animation2: Animation & {
						Weight: NumberValue;
					};
					Animation3: Animation & {
						Weight: NumberValue;
					};
					Animation1: Animation & {
						Weight: NumberValue;
					};
				};
				ScaleDampeningPercent: NumberValue;
				fall: StringValue & {
					FallAnim: Animation;
				};
				laugh: StringValue & {
					LaughAnim: Animation;
				};
				idle: StringValue & {
					Animation2: Animation & {
						Weight: NumberValue;
					};
					Animation1: Animation & {
						Weight: NumberValue;
					};
				};
				jump: StringValue & {
					JumpAnim: Animation;
				};
				sit: StringValue & {
					SitAnim: Animation;
				};
				run: StringValue & {
					RunAnim: Animation;
				};
				swim: StringValue & {
					Swim: Animation;
				};
				mood: StringValue & {
					Animation1: Animation;
				};
				wave: StringValue & {
					WaveAnim: Animation;
				};
				PlayEmote: BindableFunction;
				toollunge: StringValue & {
					ToolLungeAnim: Animation;
				};
				toolslash: StringValue & {
					ToolSlashAnim: Animation;
				};
				swimidle: StringValue & {
					SwimIdle: Animation;
				};
				dance2: StringValue & {
					Animation2: Animation & {
						Weight: NumberValue;
					};
					Animation3: Animation & {
						Weight: NumberValue;
					};
					Animation1: Animation & {
						Weight: NumberValue;
					};
				};
				walk: StringValue & {
					WalkAnim: Animation;
				};
			};
			Humanoid: Humanoid & {
				BodyTypeScale: NumberValue;
				HumanoidDescription: HumanoidDescription;
				HeadScale: NumberValue;
				BodyProportionScale: NumberValue;
				Animator: Animator;
				BodyWidthScale: NumberValue;
				BodyDepthScale: NumberValue;
				BodyHeightScale: NumberValue;
			};
			RightUpperArm: MeshPart & {
				RightUpperArm: WrapTarget;
				RightElbowRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				OriginalSize: Vector3Value;
				RightShoulderRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				RightShoulderAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				RightShoulder: Motor6D;
			};
			RightUpperLeg: MeshPart & {
				RightHip: Motor6D;
				RightHipRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				RightKneeRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				RightUpperLeg: WrapTarget;
				OriginalSize: Vector3Value;
			};
			RightFoot: MeshPart & {
				RightFootAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				RightAnkle: Motor6D;
				OriginalSize: Vector3Value;
				RightFoot: WrapTarget;
				RightAnkleRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
			};
		};
	};
	NPCs: Folder;
	ViewModels: Folder & {
		StandardKey: Model & {
			AnimationController: AnimationController & {
				Animator: Animator;
			};
			LeftLowerArm: MeshPart & {
				LeftElbow: Motor6D;
			};
			RightUpperArm: MeshPart;
			AnimSaves: ObjectValue;
			Root: Part & {
				Handle: Motor6D;
				RightUpperArm: Motor6D;
				LeftUpperArm: Motor6D;
			};
			RightHand: MeshPart & {
				RightWrist: Motor6D;
			};
			LeftUpperArm: MeshPart;
			RightLowerArm: MeshPart & {
				RightElbow: Motor6D;
			};
			LeftHand: MeshPart & {
				LeftWrist: Motor6D;
			};
			KeyReal: Model & {
				Handle: Part & {
					KeyPart: Motor6D;
				};
				KeyPart: MeshPart;
			};
			Animations: Folder;
		};
	};
	GUIs: Folder;
	Remotes: Folder & {
		TriggerFlicker: RemoteEvent;
		Jumpscare: RemoteEvent;
		TriggerDistortion: RemoteEvent;
		AfkEvent: RemoteEvent;
		PlayerInit: RemoteEvent;
		NPCInit: RemoteEvent;
	};
	TS: Folder & {
		Utility: Folder & {
			drawRayResults: ModuleScript;
			getRayDirections: ModuleScript;
			disconnectAndClear: ModuleScript;
		};
		Gameplay: Folder & {
			Utility: Folder & {
				logger: ModuleScript;
				playRandomSoundFromSource: ModuleScript;
				playSoundFromSource: ModuleScript;
				bindSoundsToAnimationEvents: ModuleScript;
				helpers: ModuleScript;
				lerp: ModuleScript;
			};
			Constants: ModuleScript;
			Scripts: Folder & {
				ViewModelController: ModuleScript;
				PlayerController: ModuleScript;
				NPCController: ModuleScript;
			};
		};
	};
	rbxts_include: Folder & {
		RuntimeLib: ModuleScript;
		Promise: ModuleScript;
		node_modules: Folder & {
			["@rbxts"]: Folder & {
				services: ModuleScript;
				["compiler-types"]: Folder & {
					types: Folder;
				};
				types: Folder & {
					include: Folder & {
						generated: Folder;
					};
				};
			};
		};
	};
}
