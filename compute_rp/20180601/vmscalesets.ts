import * as adltypes from "@azure-tools/adl.types";
import * as armtypes from "@azure-tools/arm.adl";
import * as normalized from "../normalized/module";

/**
 * Describes a Virtual Machine Scale Set.
 */
export interface VirtualMachineScaleSetProperties {
	sku?: Sku;
	plan?: Plan;
	upgradePolicy?: UpgradePolicy;
	virtualMachineProfile?: VirtualMachineScaleSetVMProfile;
	readonly provisioningState?: string;
	overprovision?: boolean;
	readonly uniqueId?: string;
	singlePlacementGroup?: boolean;
	zoneBalance?: boolean;
	platformFaultDomainCount?: number;
	proximityPlacementGroup?: SubResource;
	identity?: VirtualMachineScaleSetIdentity;
	zones?: string[];
}

/**
 * Describes a virtual machine scale set sku.
 */
export interface Sku {
	name?: string;
	tier?: Tier;
	capacity?: number;
}

export type Tier = string &
	adltypes.OneOf<["Standard", "Basic"]>;

export interface Plan {
	name?: string;
	publisher?: string;
	/**
	 * Specifies the product of the image from the marketplace. This is the same value as Offer under
	 * the imageReference element.
	 */
	product?: string;
	promotionCode?: string;
}

export interface UpgradePolicy {
	/**
	 * "modelAsString": false. No default.
	 */
	mode?: UpgradeMode;
	rollingUpgradePolicy?: RollingUpgradePolicy;
	automaticOSUpgrade?: boolean;
	autoOSUpgradePolicy?: AutoOSUpgradePolicy;
}

export type UpgradeMode = string &
	adltypes.OneOf<["Automatic", "Manual", "Rolling"]>;

export interface RollingUpgradePolicy {
	maxBatchInstancePercent?: adltypes.int8 &
		adltypes.Range<0, 100> &
		adltypes.DefaultValue<20>;
	maxUnhealthyInstancePercent?: adltypes.int8 &
		adltypes.Range<0, 100> &
		adltypes.DefaultValue<20>;
	maxUnhealthyUpgradedInstancePercent?: adltypes.int8 &
		adltypes.Range<0, 100> &
		adltypes.DefaultValue<20>;

	/**
	 * [sanjai] regex for ISO 8601? <<
	 */
	pauseTimeBetweenBatches?: string & adltypes.DefaultValue<"PT0S">;
}

export interface AutoOSUpgradePolicy {
	disableAutoRollback?: boolean;
}

export interface VirtualMachineScaleSetVMProfile {
	osProfile?: VirtualMachineScaleSetOSProfile;
	storageProfile?: VirtualMachineScaleSetStorageProfile;
	additionalCapabilities?: AdditionalCapabilities;
	/** networkProfile?: VirtualMachineScaleSetNetworkProfile;
	 * diagnosticsProfile?: DiagnosticsProfile;
	 * extensionProfile?: VirtualMachineScaleSetExtensionProfile;
	 * licenseType?: string;
	 * priority?: VirtualMachinePriorityTypes;
	 * evictionPolicy?: VirtualMachineEvictionPolicyTypes;
	 */
}

export interface VirtualMachineScaleSetOSProfile {
	/**
	 * Specifies the computer name prefix for all of the virtual machines in the scale set. Computer
	 * name prefixes must be 1 to 15 characters long.
	 * >>> [sanjai] min/max not specified in the spec <<
	 */
	computerNamePrefix?: string;
	/**
	 * Specifies the name of the administrator account. <br><br> **Windows-only restriction:** Cannot
	 * end in "." <br><br> **Disallowed values:** "administrator", "admin", "user", "user1", "test",
	 * "user2", "test1", "user3", "admin1", "1", "123", "a", "actuser", "adm", "admin2", "aspnet",
	 * "backup", "console", "david", "guest", "john", "owner", "root", "server", "sql", "support",
	 * "support_388945a0", "sys", "test2", "test3", "user4", "user5". <br><br> **Minimum-length
	 * (Linux):** 1  character <br><br> **Max-length (Linux):** 64 characters <br><br> **Max-length
	 * (Windows):** 20 characters  <br><br><li> For root access to the Linux VM, see [Using root
	 * privileges on Linux virtual machines in
	 * Azure](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-linux-use-root-privileges?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)<br><li>
	 * For a list of built-in system users on Linux that should not be used in this field, see
	 * [Selecting User Names for Linux on
	 * Azure](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-linux-usernames?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
	 * >>> [sanjai] Max length 64 (linux), max length 20 (windows). Allowed values differ. <<
	 */
	adminUsername?: string;
	/**
	 * Specifies the password of the administrator account. <br><br> **Minimum-length (Windows):** 8
	 * characters <br><br> **Minimum-length (Linux):** 6 characters <br><br> **Max-length
	 * (Windows):** 123 characters <br><br> **Max-length (Linux):** 72 characters <br><br>
	 * **Complexity requirements:** 3 out of 4 conditions below need to be fulfilled <br> Has lower
	 * characters <br>Has upper characters <br> Has a digit <br> Has a special character (Regex match
	 * [\W_]) <br><br> **Disallowed values:** "abc@123", "P@$$w0rd", "P@ssw0rd", "P@ssword123",
	 * "Pa$$word", "pass@word1", "Password!", "Password1", "Password22", "iloveyou!" <br><br> For
	 * resetting the password, see [How to reset the Remote Desktop service or its login password in
	 * a Windows
	 * VM](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-windows-reset-rdp?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
	 * <br><br> For resetting root password, see [Manage users, SSH, and check or repair disks on
	 * Azure Linux VMs using the VMAccess
	 * Extension](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-linux-using-vmaccess-extension?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json#reset-root-password)
	 */
	adminPassword?: string;
	/**
	 * >>> [sanjai] base-64 encoded. Max length of bianry array is 65535  <<
	 */
	customData?: string;

	/**
	 * >>> [sanjai] Mutually exclusive propeperty constraint ??  <<
	 */
	windowsConfiguration?: WindowsConfiguration;
	linuxConfiguration?: LinuxConfiguration;

	secrets?: VaultSecretGroup[];
}

/**
 * Specifies Windows operating system settings on the virtual machine.
 */
export interface WindowsConfiguration {
	/**
	 * >>> [sanjai]  default true <<
	 */
	provisionVMAgent?: boolean;
	enableAutomaticUpdates?: boolean;
	/**
	 * Specifies the time zone of the virtual machine. e.g. "Pacific Standard Time"
	 * >>> [sanjai] Validate timezone ?  <<
	 */
	timeZone?: string;
	/**
	 * >>> [sanjai] base-64 encoded XML to be included in the Unattend.xml file, which is used by Windows Setup.
	 * WINDOWS ONLY
	 */
	additionalUnattendContent?: AdditionalUnattendContent[];
	winRM?: WinRMConfiguration;
}

/**
 * Specifies additional XML formatted information that can be included in the Unattend.xml file,
 * which is used by Windows Setup. Contents are defined by setting name, component name, and the
 * pass in which the content is applied.
 */
export interface AdditionalUnattendContent {
	/**
	 * [sanjai] Enum modelasstring=false. The only allowed value 'OobeSystem'
	 */
	passName?: PassNames;
	/**
	 * [sanjai] Enum modelasstring=false. The only allowed value 'Microsoft-Windows-Shell-Setup'
	 */
	componentName?: ComponentNames;
	/**
	 * [sanjai] Enum modelasstring=false. The only allowed values 'AutoLogon', 'FirstLogonCommands'
	 */
	settingName?: SettingNames;
	/**
	 * >>> [sanjai] base-64 encoded XML to be included in the Unattend.xml file, which is used by Windows Setup.
	 */
	content?: string;
}

/**
 * @enum ModelAsString=false
 */
export type PassNames = "OobeSystem";

/**
 * @enum ModelAsString=false
 */
export type ComponentNames = "Microsoft-Windows-Shell-Setup";

/**
 * @enum ModelAsString=false
 */
export type SettingNames = string &
	adltypes.OneOf<["AutoLogon", "FirstLogonCommands"]>;

/**
 * Describes Windows Remote Management configuration of the VM
 */
export interface WinRMConfiguration {
	listeners?: WinRMListener[];
}

/**
 * Describes Protocol and thumbprint of Windows Remote Management listener
 */
export interface WinRMListener {
	/**
	 * [sanjai] enum model as string=false : 'Http', 'Https'
	 */
	protocol?: ProtocolTypes;
	/**
	 * This is the URL of a certificate that has been uploaded to Key Vault as a secret. For adding a
	 * secret to the Key Vault, see [Add a key or secret to the key
	 * vault](https://docs.microsoft.com/azure/key-vault/key-vault-get-started/#add). In this case,
	 * your certificate needs to be It is the Base64 encoding of the following JSON Object which is
	 * encoded in UTF-8: <br><br> {<br>  "data":"<Base64-encoded-certificate>",<br>
	 * "dataType":"pfx",<br>  "password":"<pfx-file-password>"<br>}
	 */
	certificateUrl?: string;
}

/**
 * [sanjai] enum model as string=false: 'Http', 'Https'
 */
export type ProtocolTypes = string & adltypes.OneOf<["Http", "Https"]>;

/**
 * Specifies the Linux operating system settings on the virtual machine. <br><br>For a list of
 */
export interface LinuxConfiguration {
	disablePasswordAuthentication?: boolean;
	ssh?: SshConfiguration;
	/**
	 * >>> [sanjai]  default true <<
	 * Indicates whether VM agent should be provisioned so that extensions can be added
	 */
	provisionVMAgent?: boolean;
}

/**
 * SSH configuration for Linux based VMs running on Azure
 */
export interface SshConfiguration {
	publicKeys?: SshPublicKey[];
}

/**
 * Contains information about SSH certificate public key and the path on the Linux VM where the
 * public key is placed.
 */
export interface SshPublicKey {
	path?: string;
	/**
	 * SSH public key certificate used to authenticate with the VM through ssh. The key needs to be
	 * at least 2048-bit and in ssh-rsa format. <br><br> For creating ssh keys, see [Create SSH keys
	 * on Linux and Mac for Linux VMs in
	 * Azure](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-linux-mac-create-ssh-keys?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
	 */
	keyData?: string;
}

/**
 * Describes a single certificate reference in a Key Vault, and where the certificate should reside
 * on the VM.
 */
export interface VaultCertificate {
	certificateUrl?: string;
	certificateStore?: string;
}

/**
 * Describes a set of certificates which are all in the same Key Vault.
 */
export interface VaultSecretGroup {
	sourceVault?: SubResource;
	vaultCertificates?: VaultCertificate[];
}

/**
 * An interface representing SubResource.
 */
export interface SubResource {
	id?: armtypes.ArmResourceId;
}

/**
 * Describes a virtual machine scale set storage profile.
 */
export interface VirtualMachineScaleSetStorageProfile {
	imageReference?: ImageReference;
	osDisk?: VirtualMachineScaleSetOSDisk;
	dataDisks?: VirtualMachineScaleSetDataDisk[];
}

/**
 * Specifies information about the image to use. You can specify information about platform images,
 * marketplace images, or virtual machine images. This element is required when you want to use a
 * platform image, marketplace image, or virtual machine image, but is not used in other creation
 * operations.
 */
export interface ImageReference extends SubResource {
	publisher?: string;
	offer?: string;
	sku?: string;
	/**
	 * [sanjai] regex ?? allowed formats are Major.Minor.Build or 'latest'. Major, Minor, and Build are
	 * decimal numbers.
	 */
	version?: string;
}

/**
 * Describes a virtual machine scale set operating system disk.
 */
export interface VirtualMachineScaleSetOSDisk {
	name?: string;
	/**
	 * [sanjai]  enum. only values 'None', 'ReadOnly', 'ReadWrite'
	 *  Default:  Standard storage => None
	 *  Premium storage => ReadOnly
	 */
	caching?: CachingTypes;
	writeAcceleratorEnabled?: boolean;
	/**
	 * [sanjai]modelAsString = true. Allowed values 'FromImage', 'Empty', 'Attach'
	 */
	createOption: DiskCreateOptionTypes;
	diffDiskSettings?: DiffDiskSettings;
	/**
	 * Specifies the size of the operating system disk in gigabytes. This element can be used to
	 * overwrite the size of the disk in a virtual machine image. <br><br> This value cannot be
	 * larger than 1023 GB
	 */
	diskSizeGB?: number;
	/**
	 * This property allows you to specify the type of the OS that is included in the disk if
	 * creating a VM from user-image or a specialized VHD. <br><br> Possible values are: <br><br>
	 * **Windows** <br><br> **Linux**. Possible values include: 'Windows', 'Linux'
	 */
	osType?: OperatingSystemTypes;
	/**
	 * Specifies information about the unmanaged user image to base the scale set on.
	 */
	image?: VirtualHardDisk;
	/**
	 * Specifies the container urls that are used to store operating system disks for the scale set.
	 */
	vhdContainers?: string[];
	/**
	 * The managed disk parameters.
	 */
	managedDisk?: VirtualMachineScaleSetManagedDiskParameters;
}

// ENum modelasstring=false;
export type CachingTypes = string &
	adltypes.OneOf<["None", "ReadOnly", "ReadWrite"]>;

// ENum modelasstring=true;
export type DiskCreateOptionTypes = string &
	adltypes.OneOf<["FromImage", "Empty", "Attach"]>;

/**
 * Describes the parameters of ephemeral disk settings that can be specified for operating system
 * disk. <br><br> NOTE: The ephemeral disk settings can only be specified for managed disk.
 */
export interface DiffDiskSettings {
	/**
	 // ENum modelasstring=true; Possible values include: 'Local'
	 */
	option?: DiffDiskOptions;
}

// ENum modelasstring=true;
export type DiffDiskOptions = "Local";

// ENum modelasstring=false;
export type OperatingSystemTypes = string &
	adltypes.OneOf<["Windows", "Linux"]>;

/**
 * Describes the uri of a disk.
 */
export interface VirtualHardDisk {
	uri?: string;
}

/**
 * Describes the parameters of a ScaleSet managed disk.
 */
export interface VirtualMachineScaleSetManagedDiskParameters {
	/**
	 * Specifies the storage account type for the managed disk. NOTE: UltraSSD_LRS can only be used
	 * with data disks, it cannot be used with OS Disk. Possible values include: 'Standard_LRS',
	 * 'Premium_LRS', 'StandardSSD_LRS', 'UltraSSD_LRS'
	 */
	storageAccountType?: StorageAccountTypes;
}

// ENum modelasstring=true;
export type StorageAccountTypes = string &
	adltypes.OneOf<
		["Standard_LRS", "Premium_LRS", "StandardSSD_LRS", "UltraSSD_LRS"]
	>;

/**
 * Describes a virtual machine scale set data disk.
 */
export interface VirtualMachineScaleSetDataDisk {
	name?: string;
	lun: number;
	/**
	 * [sanjai]  enum. only values 'None', 'ReadOnly', 'ReadWrite'
	 *  Default:  Standard storage => None
	 *  Premium storage => ReadOnly
	 */
	caching?: CachingTypes;
	writeAcceleratorEnabled?: boolean;
	/**
	 * [sanjai]modelAsString = true. Allowed values 'FromImage', 'Empty', 'Attach'
	 */
	createOption: DiskCreateOptionTypes;
	/**
	 * [sanjai] max  1023 GB
	 */
	diskSizeGB?: number;
	managedDisk?: VirtualMachineScaleSetManagedDiskParameters;
}

/**
 * Enables or disables a capability on the virtual machine or virtual machine scale set.
 */
export interface AdditionalCapabilities {
	ultraSSDEnabled?: boolean;
}

/**
 * Identity for the virtual machine scale set.
 */
export interface VirtualMachineScaleSetIdentity {
	readonly principalId?: string;
	readonly tenantId?: string;
	/**
	 * [sanjai] Model as string false: 'SystemAssigned', 'UserAssigned', 'SystemAssigned, UserAssigned',
	 * 'None'
	 */
	type?: ResourceIdentityType;
	/**
	 * The list of user identities associated with the virtual machine scale set. The user identity
	 * dictionary key references will be ARM resource ids in the form:
	 * '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'.
	 */
	userAssignedIdentities?: {
		[propertyName: string]: VirtualMachineScaleSetIdentityUserAssignedIdentitiesValue;
	};
}

// [sanjai] Model as string false
export type ResourceIdentityType = string &
	adltypes.OneOf<
		["SystemAssigned", "UserAssigned", "SystemAssigned, UserAssigned", "None"]
	>;

/**
 * An interface representing VirtualMachineScaleSetIdentityUserAssignedIdentitiesValue.
 */
export interface VirtualMachineScaleSetIdentityUserAssignedIdentitiesValue {
	readonly principalId?: string;
	readonly clientId?: string;
}

// Wrap in ARM envelope to make it an ARM resource
export type VirtualMachineScaleSet20180601 = armtypes.ArmVersionedResource<
	VirtualMachineScaleSetProperties
>;
