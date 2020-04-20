import * as adltypes from "@azure-tools/adl.types";
import * as armtypes from "@azure-tools/arm.adl";

// Wrap in ARM envelope to make it an ARM resource
export type VirtualMachineScaleSet20180601 = armtypes.ArmVersionedResource<VMSSProperties>;

export interface VirtualMachineScaleSetBaseProperties {
   /**
   * The virtual machine scale set sku.
   */
  sku?: Sku;
  /**
   * Specifies information about the marketplace image used to create the virtual machine. This
   * element is only used for marketplace images. Before you can use a marketplace image from an
   * API, you must enable the image for programmatic use.  In the Azure portal, find the
   * marketplace image that you want to use and then click **Want to deploy programmatically, Get
   * Started ->**. Enter any required information and then click **Save**.
   */
  plan?: Plan;
  /**
   * The virtual machine profile.
   */
  virtualMachineProfile?: VirtualMachineScaleSetVMProfile;
  /**
   * The provisioning state, which only appears in the response.
   * **NOTE: This property will not be serialized. It can only be populated by the server.**
   */
  provisioningState?: string & adltypes.ReadOnly;
    /**
   * Specifies whether the Virtual Machine Scale Set should be overprovisioned.
   */
  overprovision?: boolean;
    /**
   * Specifies the ID which uniquely identifies a Virtual Machine Scale Set.
   * **NOTE: This property will not be serialized. It can only be populated by the server.**
   */
  uniqueId?: adltypes.uuid & adltypes.ReadOnly;
  /**
   * When true this limits the scale set to a single placement group, of max size 100 virtual
   * machines.
   */
  singlePlacementGroup?: boolean;
  /**
   * Whether to force strictly even Virtual Machine distribution cross x-zones in case there is
   * zone outage.
   */
  zoneBalance?: boolean;
  /**
   * Fault Domain count for each placement group.
   */
  platformFaultDomainCount?: number;
  /**
   * Specifies information about the proximity placement group that the virtual machine scale set
   * should be assigned to. <br><br>Minimum api-version: 2018-04-01.
   */
  proximityPlacementGroup?: SubResource;
  /**
   * The identity of the virtual machine scale set, if configured.
   */
  identity?: VirtualMachineScaleSetIdentity;
  /**
   * The virtual machine scale set zones.
   */
    zones?: string[];
}


/**
 * Defines values for UpgradeMode.
 * Possible values include: 'Automatic', 'Manual', 'Rolling'
 * @readonly
 * @enum {string}
 * @enum_Automatic Automatic upgrade
 * @enum_Manual Manual upgrade
 * @enum_Rolling Rolling upgrade
 */
export type UpgradeMode = string & adltypes.OneOf<["Automatic", "Manual", "Rolling"]>;

export interface RollingUpgradePolicy {
  /**
   * The maximum percent of total virtual machine instances that will be upgraded simultaneously by
   * the rolling upgrade in one batch. As this is a maximum, unhealthy instances in previous or
   * future batches can cause the percentage of instances in a batch to decrease to ensure higher
   * reliability. The default value for this parameter is 20%.
   */
  maxBatchInstancePercent?: adltypes.int8 & adltypes.Range<0, 100> & adltypes.DefaultValue<20>;
  /**
   * The maximum percentage of the total virtual machine instances in the scale set that can be
   * simultaneously unhealthy, either as a result of being upgraded, or by being found in an
   * unhealthy state by the virtual machine health checks before the rolling upgrade aborts. This
   * constraint will be checked prior to starting any batch. The default value for this parameter
   * is 20%.
   */
  maxUnhealthyInstancePercent?: adltypes.int8 & adltypes.Range<0, 100> & adltypes.DefaultValue<20>;
  /**
   * The maximum percentage of upgraded virtual machine instances that can be found to be in an
   * unhealthy state. This check will happen after each batch is upgraded. If this percentage is
   * ever exceeded, the rolling update aborts. The default value for this parameter is 20%.
   */
  maxUnhealthyUpgradedInstancePercent?: adltypes.int8 & adltypes.Range<0, 100> & adltypes.DefaultValue<20>;
  /**
   * The wait time between completing the update for all virtual machines in one batch and starting
   * the next batch. The time duration should be specified in ISO 8601 format. The default value is
   * 0 seconds (PT0S).
   */
  pauseTimeBetweenBatches?: adltypes.duration &
        adltypes.DefaultValue<"PT0S">;
}

interface VMSSProperties extends VirtualMachineScaleSetBaseProperties{
    upgradePolicy?: UpgradePolicy
}

export interface Plan {
    /**
   * The plan ID.
   */
  name?: string;
    /**
   * The publisher ID.
   */
  publisher?: string;
    /**
     * Specifies the product of the image from the marketplace. This is the same value as Offer under
     * the imageReference element.
     */
  product?: string;
  /**
   * The promotion code.
   */
    promotionCode?: string;
}

export interface UpgradePolicy {
    /**
   * Specifies the mode of an upgrade to virtual machines in the scale set.<br /><br /> Possible
   * values are:<br /><br /> **Manual** - You  control the application of updates to virtual
   * machines in the scale set. You do this by using the manualUpgrade action.<br /><br />
   * **Automatic** - All virtual machines in the scale set are  automatically updated at the same
   * time. Possible values include: 'Automatic', 'Manual', 'Rolling'
   */
  mode?: UpgradeMode;
    /**
   * The configuration parameters used while performing a rolling upgrade.
   */
  rollingUpgradePolicy?: RollingUpgradePolicy;
    /**
   * Whether OS upgrades should automatically be applied to scale set instances in a rolling
   * fashion when a newer version of the image becomes available.
   */
  automaticOSUpgrade?: boolean;
    /**
   * Configuration parameters used for performing automatic OS Upgrade.
   */
  autoOSUpgradePolicy?: AutoOSUpgradePolicy;
}


/**
 * The configuration parameters used for performing automatic OS upgrade.
 */
export interface AutoOSUpgradePolicy {
  /**
   * Whether OS image rollback feature should be disabled. Default value is false.
   */
  disableAutoRollback?: boolean;
}

export interface VirtualMachineScaleSetVMProfile {
  /**
   * Specifies the operating system settings for the virtual machines in the scale set.
   */
  osProfile?: VirtualMachineScaleSetOSProfile;
  /**
   * Specifies the storage settings for the virtual machine disks.
   */
  storageProfile?: VirtualMachineScaleSetStorageProfile;
  /**
   * Specifies additional capabilities enabled or disabled on the virtual machine in the scale set.
   * For instance: whether the virtual machine has the capability to support attaching managed data
   * disks with UltraSSD_LRS storage account type.
   */
  additionalCapabilities?: AdditionalCapabilities;
  /**
   * Specifies properties of the network interfaces of the virtual machines in the scale set.
   */
  networkProfile?: VirtualMachineScaleSetNetworkProfile;
  /**
   * Specifies the boot diagnostic settings state. <br><br>Minimum api-version: 2015-06-15.
   */
  diagnosticsProfile?: DiagnosticsProfile;
  /**
   * Specifies a collection of settings for extensions installed on virtual machines in the scale
   * set.
   */
  extensionProfile?: VirtualMachineScaleSetExtensionProfile;
  /**
   * Specifies that the image or disk that is being used was licensed on-premises. This element is
   * only used for images that contain the Windows Server operating system. <br><br> Possible
   * values are: <br><br> Windows_Client <br><br> Windows_Server <br><br> If this element is
   * included in a request for an update, the value must match the initial value. This value cannot
   * be updated. <br><br> For more information, see [Azure Hybrid Use Benefit for Windows
   * Server](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-windows-hybrid-use-benefit-licensing?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
   * <br><br> Minimum api-version: 2015-06-15
   */
  licenseType?: string;
  /**
   * Specifies the priority for the virtual machines in the scale set. <br><br>Minimum api-version:
   * 2017-10-30-preview. Possible values include: 'Regular', 'Low'
   */
  priority?: VirtualMachinePriorityTypes;
  /**
   * Specifies the eviction policy for virtual machines in a low priority scale set.
   * <br><br>Minimum api-version: 2017-10-30-preview. Possible values include: 'Deallocate',
   * 'Delete'
   */
  evictionPolicy?: VirtualMachineEvictionPolicyTypes;
}

/**
 * Describes a virtual machine scale set OS profile.
 */
export interface VirtualMachineScaleSetOSProfile {
  /**
   * Specifies the host OS name of the virtual machine. <br><br> This name cannot be updated after
   * the VM is created. <br><br> **Max-length (Windows):** 15 characters <br><br> **Max-length
   * (Linux):** 64 characters. <br><br> For naming conventions and restrictions see [Azure
   * infrastructure services implementation
   * guidelines](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-linux-infrastructure-subscription-accounts-guidelines?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json#1-naming-conventions).
   */
  computerNamePrefix?: string &
        adltypes.MinLength<1> &
        adltypes.MaxLength<15>;
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
   */
    adminUsername?: string &
        adltypes.MinLength<1> &
        adltypes.MaxLength<64>;

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
    adminPassword?: string &
        adltypes.MinLength<6> &
        adltypes.MaxLength<123>;

    /**
   * Specifies a base-64 encoded string of custom data. The base-64 encoded string is decoded to a
   * binary array that is saved as a file on the Virtual Machine. The maximum length of the binary
   * array is 65535 bytes. <br><br> For using cloud-init for your VM, see [Using cloud-init to
   * customize a Linux VM during
   * creation](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-linux-using-cloud-init?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
   */
    customData?: adltypes.base64 &
        adltypes.MaxLength<65535>;

    /**
   * Specifies Windows operating system settings on the virtual machine.
   */
  windowsConfiguration?: WindowsConfiguration;
  /**
   * Specifies the Linux operating system settings on the virtual machine. <br><br>For a list of
   * supported Linux distributions, see [Linux on Azure-Endorsed
   * Distributions](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-linux-endorsed-distros?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
   * <br><br> For running non-endorsed distributions, see [Information for Non-Endorsed
   * Distributions](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-linux-create-upload-generic?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
   */
    linuxConfiguration?: LinuxConfiguration;

  /**
   * Specifies set of certificates that should be installed onto the virtual machine.
   */
  secrets?: VaultSecretGroup[] & adltypes.Secret;

  /**
   * Specifies whether extension operations should be allowed on the virtual machine. <br><br>This
   * may only be set to False when no extensions are present on the virtual machine.
   */
  allowExtensionOperations?: boolean;
}

/**
 * Specifies Windows operating system settings on the virtual machine.
 */
export interface WindowsConfiguration {
  /**
   * Indicates whether virtual machine agent should be provisioned on the virtual machine. <br><br>
   * When this property is not specified in the request body, default behavior is to set it to
   * true.  This will ensure that VM Agent is installed on the VM so that extensions can be added
   * to the VM later.
   */
  provisionVMAgent?: boolean &
    adltypes.DefaultValue<true>;
  /**
   * Indicates whether virtual machine is enabled for automatic updates.
   */
  enableAutomaticUpdates?: boolean;
  /**
   * Specifies the time zone of the virtual machine. e.g. "Pacific Standard Time"
   */
  timeZone?: string;
  /**
   * Specifies additional base-64 encoded XML formatted information that can be included in the
   * Unattend.xml file, which is used by Windows Setup.
   */
  additionalUnattendContent?: AdditionalUnattendContent[];
  /**
   * Specifies the Windows Remote Management listeners. This enables remote Windows PowerShell.
   */
  winRM?: WinRMConfiguration;
}

/**
 * Specifies additional XML formatted information that can be included in the Unattend.xml file,
 * which is used by Windows Setup. Contents are defined by setting name, component name, and the
 * pass in which the content is applied.
 */
export interface AdditionalUnattendContent {
    /**
   * The pass name. Currently, the only allowable value is OobeSystem. Possible values include:
   * 'OobeSystem'
   */
  passName?: PassNames;
  /**
   * The component name. Currently, the only allowable value is Microsoft-Windows-Shell-Setup.
   * Possible values include: 'Microsoft-Windows-Shell-Setup'
   */
  componentName?: ComponentNames;
  /**
   * Specifies the name of the setting to which the content applies. Possible values are:
   * FirstLogonCommands and AutoLogon. Possible values include: 'AutoLogon', 'FirstLogonCommands'
   */
  settingName?: SettingNames;
  /**
   * Specifies the XML formatted content that is added to the unattend.xml file for the specified
   * path and component. The XML must be less than 4KB and must include the root element for the
   * setting or feature that is being inserted.
   */
  content?: string & adltypes.base64;
}

/**
 * Defines values for PassNames.
 * Possible values include: 'OobeSystem'
 * @readonly
 * @enum {string}
 * @enum_OobeSystem OOBE system
 */
export type PassNames = string &
    adltypes.OneOf<["OobeSystem"]>;

/**
 * Defines values for ComponentNames.
 * Possible values include: 'Microsoft-Windows-Shell-Setup'
 * @readonly
 * @enum {string}
 * @enum_MicrosoftWindowsShellSetup
 */
export type ComponentNames = string &
    adltypes.OneOf<["Microsoft-Windows-Shell-Setup"]>;

/**
 * Defines values for SettingNames.
 * Possible values include: 'AutoLogon', 'FirstLogonCommands'
 * @readonly
 * @enum {string}
 * @enum_Autologon
 * @enum_FirstLongCommands
 */
export type SettingNames = string &
    adltypes.OneOf<["AutoLogon", "FirstLogonCommands"]>;

/**
 * Describes Windows Remote Management configuration of the VM
 */
export interface WinRMConfiguration {
  /**
   * The list of Windows Remote Management listeners
   */
    listeners?: WinRMListener[];
}

/**
 * Describes Protocol and thumbprint of Windows Remote Management listener
 */
export interface WinRMListener {
    /**
   * Specifies the protocol of listener. <br><br> Possible values are: <br>**http** <br><br>
   * **https**. Possible values include: 'Http', 'Https'
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
    certificateUrl?: adltypes.uri & adltypes.Secret;
}

/**
 * Defines values for ProtocolTypes.
 * Possible values include: 'Http', 'Https'
 * @readonly
 * @enum {string}
 * @enum_Http Http protocol
 * @enum_Https Https protocol
 */
export type ProtocolTypes = string & adltypes.OneOf<["Http", "Https"]>;

/**
 * Specifies the Linux operating system settings on the virtual machine. <br><br>For a list of
 */
export interface LinuxConfiguration {
    /**
   * Specifies whether password authentication should be disabled.
   */
  disablePasswordAuthentication?: boolean;
  /**
   * Specifies the ssh key configuration for a Linux OS.
   */
  ssh?: SshConfiguration;
  /**
   * Indicates whether virtual machine agent should be provisioned on the virtual machine. <br><br>
   * When this property is not specified in the request body, default behavior is to set it to
   * true.  This will ensure that VM Agent is installed on the VM so that extensions can be added
   * to the VM later.
   */
    provisionVMAgent?: boolean & adltypes.DefaultValue<true>;
}

/**
 * SSH configuration for Linux based VMs running on Azure
 */
export interface SshConfiguration {
  /**
   * The list of SSH public keys used to authenticate with linux based VMs.
   */
  publicKeys?: SshPublicKey[] & adltypes.Secret;
}

/**
 * Contains information about SSH certificate public key and the path on the Linux VM where the
 * public key is placed.
 */
export interface SshPublicKey {
  /**
   * Specifies the full path on the created VM where ssh public key is stored. If the file already
   * exists, the specified key is appended to the file. Example: /home/user/.ssh/authorized_keys
   */
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
  /**
   * This is the URL of a certificate that has been uploaded to Key Vault as a secret. For adding a
   * secret to the Key Vault, see [Add a key or secret to the key
   * vault](https://docs.microsoft.com/azure/key-vault/key-vault-get-started/#add). In this case,
   * your certificate needs to be It is the Base64 encoding of the following JSON Object which is
   * encoded in UTF-8: <br><br> {<br>  "data":"<Base64-encoded-certificate>",<br>
   * "dataType":"pfx",<br>  "password":"<pfx-file-password>"<br>}
   */
  certificateUrl?: adltypes.uri;
  /**
   * For Windows VMs, specifies the certificate store on the Virtual Machine to which the
   * certificate should be added. The specified certificate store is implicitly in the LocalMachine
   * account. <br><br>For Linux VMs, the certificate file is placed under the /var/lib/waagent
   * directory, with the file name &lt;UppercaseThumbprint&gt;.crt for the X509 certificate file
   * and &lt;UppercaseThumbprint&gt;.prv for private key. Both of these files are .pem formatted.
   */
  certificateStore?: string;
}

/**
 * Describes a set of certificates which are all in the same Key Vault.
 */
export interface VaultSecretGroup {
  /**
   * The relative URL of the Key Vault containing all of the certificates in VaultCertificates.
   */
  sourceVault?: SubResource;
  /**
   * The list of key vault references in SourceVault which contain certificates.
   */
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
  /**
   * Specifies information about the image to use. You can specify information about platform
   * images, marketplace images, or virtual machine images. This element is required when you want
   * to use a platform image, marketplace image, or virtual machine image, but is not used in other
   * creation operations.
   */
  imageReference?: ImageReference;
  /**
   * Specifies information about the operating system disk used by the virtual machines in the
   * scale set. <br><br> For more information about disks, see [About disks and VHDs for Azure
   * virtual
   * machines](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-windows-about-disks-vhds?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
   */
  osDisk?: VirtualMachineScaleSetOSDisk;
  /**
   * Specifies the parameters that are used to add data disks to the virtual machines in the scale
   * set. <br><br> For more information about disks, see [About disks and VHDs for Azure virtual
   * machines](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-windows-about-disks-vhds?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
   */
  dataDisks?: VirtualMachineScaleSetDataDisk[];
}

/**
     * Allowed formats are Major.Minor.Build or 'latest'. Major, Minor, and Build are decimal numbers.
*/
export type imageReferenceVersion = string & adltypes.MustMatch<"^\\b([0-9]+\\.[0-9]+\\.[0-9]+?|latest)\\b$", /*ignoreCase*/ true>;

/**
 * Specifies information about the image to use. You can specify information about platform images,
 * marketplace images, or virtual machine images. This element is required when you want to use a
 * platform image, marketplace image, or virtual machine image, but is not used in other creation
 * operations.
 */
export interface ImageReference extends SubResource {
    /**
   * The image publisher.
   */
  publisher?: string;
  /**
   * Specifies the offer of the platform image or marketplace image used to create the virtual
   * machine.
   */
  offer?: string;
  /**
   * The image SKU.
   */
  sku?: string;
  /**
   * Specifies the version of the platform image or marketplace image used to create the virtual
   * machine. The allowed formats are Major.Minor.Build or 'latest'. Major, Minor, and Build are
   * decimal numbers. Specify 'latest' to use the latest version of an image available at deploy
   * time. Even if you use 'latest', the VM image will not automatically update after deploy time
   * even if a new version becomes available.
   */
    version?: imageReferenceVersion;
}

/**
 * Describes a virtual machine scale set operating system disk.
 */
export interface VirtualMachineScaleSetOSDisk {
    /**
   * The disk name.
   */
  name?: string;

    /**
   * Specifies the caching requirements. <br><br> Possible values are: <br><br> **None** <br><br>
   * **ReadOnly** <br><br> **ReadWrite** <br><br> Default: **None for Standard storage. ReadOnly
   * for Premium storage**. Possible values include: 'None', 'ReadOnly', 'ReadWrite'
   */
  caching?: CachingTypes;

  /**
   * Specifies whether writeAccelerator should be enabled or disabled on the disk.
   */
  writeAcceleratorEnabled?: boolean;

    /**
   * Specifies how the virtual machines in the scale set should be created.<br><br> The only
   * allowed value is: **FromImage** \u2013 This value is used when you are using an image to
   * create the virtual machine. If you are using a platform image, you also use the imageReference
   * element described above. If you are using a marketplace image, you  also use the plan element
   * previously described. Possible values include: 'FromImage', 'Empty', 'Attach'
   */
    createOption: DiskCreateOptionTypes;
  /**
   * Specifies the ephemeral Disk Settings for the operating system disk used by the virtual
   * machine.
   */
  diffDiskSettings?: DiffDiskSettings;
  /**
   * Specifies the size of the operating system disk in gigabytes. This element can be used to
   * overwrite the size of the disk in a virtual machine image. <br><br> This value cannot be
   * larger than 1023 GB
   */
  diskSizeGB?: number & adltypes.Maximum<1023>;
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
  vhdContainers?: adltypes.uri[];
  /**
   * The managed disk parameters.
   */
    managedDisk?: VirtualMachineScaleSetManagedDiskParameters;
}

/**
 * Defines values for CachingTypes.
 * Possible values include: 'None', 'ReadOnly', 'ReadWrite'
 * @readonly
 * @enum {string}
 * @enum_None No caching
 * @enum_ReadOnly Cache reads
 * @enum_ReadWrite Cache read/writes
 */
export type CachingTypes = string &
    adltypes.OneOf<["None", "ReadOnly", "ReadWrite"]>;

/**
 * Defines values for DiskCreateOptionTypes.
 * Possible values include: 'FromImage', 'Empty', 'Attach'
 * @readonly
 * @enum {string}
 * @enum_FromImage Create from image
 * @enum_Empty Create empty
 * @enum_Attach Attach an existing image
 */
export type DiskCreateOptionTypes = string &
    adltypes.OneOf<["FromImage", "Empty", "Attach"]>;

/**
 * Describes the parameters of ephemeral disk settings that can be specified for operating system
 * disk. <br><br> NOTE: The ephemeral disk settings can only be specified for managed disk.
 */
export interface DiffDiskSettings {
  /**
   * Specifies the ephemeral disk settings for operating system disk. Possible values include:
   * 'Local'
   */
  option?: DiffDiskOptions;
}

/**
 * Defines values for DiffDiskOptions.
 * Possible values include: 'Local'
 * @readonly
 * @enum {string}
 * @enum_Local Local
 */
export type DiffDiskOptions = string &
    adltypes.OneOf<["Local"]>;

/**
 * This property allows you to specify the type of the OS that is included in the disk if
 * creating a VM from user-image or a specialized VHD. <br><br> Possible values are: <br><br>
 * **Windows** <br><br> **Linux**. Possible values include: 'Windows', 'Linux'
 * @enum_Windows Windows operating system
 * @enum_Linux Linux operation system
 */
export type OperatingSystemTypes = string &
    adltypes.OneOf<["Windows", "Linux"]>;

/**
 * Describes the uri of a disk.
 */
export interface VirtualHardDisk {
  /**
   * Specifies the virtual hard disk's uri.
   */
    uri?: adltypes.uri;
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

/**
 * Defines values for StorageAccountTypes.
 * Possible values include: 'Standard_LRS', 'Premium_LRS', 'StandardSSD_LRS', 'UltraSSD_LRS'
 * @readonly
 * @enum {string}
 * @enum_Standard_LRS Standard LRS storage account type
 * @enum_Premium_LRS Premium LRS storage account type
 * @enum_StandardSSD_LRS Standard SSD LRS storage account type
 * @enum_UltraSSD_LRS Ultra SSD LRS storage account type
 */
export type StorageAccountTypes = string &
    adltypes.OneOf<
        ["Standard_LRS", "Premium_LRS", "StandardSSD_LRS", "UltraSSD_LRS"]
    >;

/**
 * Describes a virtual machine scale set data disk.
 */
export interface VirtualMachineScaleSetDataDisk {
  /**
   * The disk name.
   */
  name?: string;
  /**
   * Specifies the logical unit number of the data disk. This value is used to identify data disks
   * within the VM and therefore must be unique for each data disk attached to a VM.
   */
  lun: number;
  /**
   * Specifies the caching requirements. <br><br> Possible values are: <br><br> **None** <br><br>
   * **ReadOnly** <br><br> **ReadWrite** <br><br> Default: **None for Standard storage. ReadOnly
   * for Premium storage**. Possible values include: 'None', 'ReadOnly', 'ReadWrite'
   */
  caching?: CachingTypes;
  /**
   * Specifies whether writeAccelerator should be enabled or disabled on the disk.
   */
  writeAcceleratorEnabled?: boolean;
  /**
   * The create option. Possible values include: 'FromImage', 'Empty', 'Attach'
   */
  createOption: DiskCreateOptionTypes;
  /**
   * Specifies the size of an empty data disk in gigabytes. This element can be used to overwrite
   * the size of the disk in a virtual machine image. <br><br> This value cannot be larger than
   * 1023 GB
   */
  diskSizeGB?: number & adltypes.Maximum<1023>;
  /**
   * The managed disk parameters.
   */
  managedDisk?: VirtualMachineScaleSetManagedDiskParameters;
}

/**
 * Enables or disables a capability on the virtual machine or virtual machine scale set.
 */
export interface AdditionalCapabilities {
  /**
   * The flag that enables or disables a capability to have one or more managed data disks with
   * UltraSSD_LRS storage account type on the VM or VMSS. Managed disks with storage account type
   * UltraSSD_LRS can be added to a virtual machine or virtual machine scale set only if this
   * property is enabled.
   */
    ultraSSDEnabled?: boolean;
}

/**
 * Identity for the virtual machine scale set.
 */
export interface VirtualMachineScaleSetIdentity {
  /**
   * The principal id of virtual machine identity. This property will only be provided for a system
   * assigned identity.
   * **NOTE: This property will not be serialized. It can only be populated by the server.**
   */
  principalId?: adltypes.uuid & adltypes.ReadOnly;

  /**
   * The tenant id associated with the virtual machine. This property will only be provided for a
   * system assigned identity.
   * **NOTE: This property will not be serialized. It can only be populated by the server.**
   */
  tenantId?: adltypes.uuid & adltypes.ReadOnly;

    /**
   * The type of identity used for the virtual machine. The type 'SystemAssigned, UserAssigned'
   * includes both an implicitly created identity and a set of user assigned identities. The type
   * 'None' will remove any identities from the virtual machine. Possible values include:
   * 'SystemAssigned', 'UserAssigned', 'SystemAssigned, UserAssigned', 'None'
   */
    type?: ResourceIdentityType;

  /**
   * The list of user identities associated with the Virtual Machine. The user identity dictionary
   * key references will be ARM resource ids in the form:
   * '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'.
   */
   userAssignedIdentities?: adltypes.AdlMap<string, VirtualMachineScaleSetIdentityUserAssignedIdentitiesValue>;
}

/**
 * Defines values for ResourceIdentityType.
 * Possible values include: 'SystemAssigned', 'UserAssigned', 'SystemAssigned, UserAssigned',
 * 'None'
 * @readonly
 * @enum {string}
 * @enum_SystemAssigned System assigned identity
 * @enum_UserAssigned User assigned identity
 * @enum_SystemAssigned_UserAssigned Both system and user assigned identity
 * @enum_None None
 */
export type ResourceIdentityType = string &
    adltypes.OneOf<
        ["SystemAssigned", "UserAssigned", "SystemAssigned, UserAssigned", "None"]
    >;

/**
 * An interface representing VirtualMachineScaleSetIdentityUserAssignedIdentitiesValue.
 */
export interface VirtualMachineScaleSetIdentityUserAssignedIdentitiesValue {
  /**
   * The principal id of user assigned identity.
   * **NOTE: This property will not be serialized. It can only be populated by the server.**
   */
  principalId?: adltypes.uuid & adltypes.ReadOnly;
  /**
   * The client id of user assigned identity.
   * **NOTE: This property will not be serialized. It can only be populated by the server.**
   */
  clientId?: adltypes.uuid & adltypes.ReadOnly;
}

/**
 * Describes a virtual machine scale set network profile.
 */
export interface VirtualMachineScaleSetNetworkProfile {
  /**
   * A reference to a load balancer probe used to determine the health of an instance in the
   * virtual machine scale set. The reference will be in the form:
   * '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/loadBalancers/{loadBalancerName}/probes/{probeName}'.
   */
  healthProbe?: ApiEntityReference;
  /**
   * The list of network configurations.
   */
  networkInterfaceConfigurations?: VirtualMachineScaleSetNetworkConfiguration[];
}

/**
 * The API entity reference.
 */
export interface ApiEntityReference {
  /**
   * The ARM resource id in the form of
   * /subscriptions/{SubscriptionId}/resourceGroups/{ResourceGroupName}/...
   */
  id?: armtypes.ArmResourceId;
}

/**
 * Describes a virtual machine scale set network profile's network configurations.
 */
export interface VirtualMachineScaleSetNetworkConfiguration extends SubResource {
  /**
   * The network configuration name.
   */
  name: string;
  /**
   * Specifies the primary network interface in case the virtual machine has more than 1 network
   * interface.
   */
  primary?: boolean;
  /**
   * Specifies whether the network interface is accelerated networking-enabled.
   */
  enableAcceleratedNetworking?: boolean;
  /**
   * The network security group.
   */
  networkSecurityGroup?: SubResource;
  /**
   * The dns settings to be applied on the network interfaces.
   */
  dnsSettings?: VirtualMachineScaleSetNetworkConfigurationDnsSettings;
  /**
   * Specifies the IP configurations of the network interface.
   */
  ipConfigurations: VirtualMachineScaleSetIPConfiguration[];
  /**
   * Whether IP forwarding enabled on this NIC.
   */
  enableIPForwarding?: boolean;
}

/**
 * Describes a virtual machines scale sets network configuration's DNS settings.
 */
export interface VirtualMachineScaleSetNetworkConfigurationDnsSettings {
  /**
   * List of DNS servers IP addresses
   */
  dnsServers?: adltypes.ipaddress[];
}

/**
 * Describes a virtual machine scale set network profile's IP configuration.
 */
export interface VirtualMachineScaleSetIPConfiguration extends SubResource {
  /**
   * The IP configuration name.
   */
  name: string;
  /**
   * Specifies the identifier of the subnet.
   */
  subnet?: ApiEntityReference;
  /**
   * Specifies the primary network interface in case the virtual machine has more than 1 network
   * interface.
   */
  primary?: boolean;
  /**
   * The publicIPAddressConfiguration.
   */
  publicIPAddressConfiguration?: VirtualMachineScaleSetPublicIPAddressConfiguration;
  /**
   * Available from Api-Version 2017-03-30 onwards, it represents whether the specific
   * ipconfiguration is IPv4 or IPv6. Default is taken as IPv4.  Possible values are: 'IPv4' and
   * 'IPv6'. Possible values include: 'IPv4', 'IPv6'
   */
  privateIPAddressVersion?: IPVersion & adltypes.DefaultValue<"IPv4">;
  /**
   * Specifies an array of references to backend address pools of application gateways. A scale set
   * can reference backend address pools of multiple application gateways. Multiple scale sets
   * cannot use the same application gateway.
   */
  applicationGatewayBackendAddressPools?: SubResource[];
  /**
   * Specifies an array of references to application security group.
   */
  applicationSecurityGroups?: SubResource[];
  /**
   * Specifies an array of references to backend address pools of load balancers. A scale set can
   * reference backend address pools of one public and one internal load balancer. Multiple scale
   * sets cannot use the same load balancer.
   */
  loadBalancerBackendAddressPools?: SubResource[];
  /**
   * Specifies an array of references to inbound Nat pools of the load balancers. A scale set can
   * reference inbound nat pools of one public and one internal load balancer. Multiple scale sets
   * cannot use the same load balancer
   */
  loadBalancerInboundNatPools?: SubResource[];
}


/**
 * Describes a virtual machines scale set IP Configuration's PublicIPAddress configuration
 */
export interface VirtualMachineScaleSetPublicIPAddressConfiguration {
  /**
   * The publicIP address configuration name.
   */
  name: string;
  /**
   * The idle timeout of the public IP address.
   */
  idleTimeoutInMinutes?: number;
  /**
   * The dns settings to be applied on the publicIP addresses .
   */
  dnsSettings?: VirtualMachineScaleSetPublicIPAddressConfigurationDnsSettings;
  /**
   * The list of IP tags associated with the public IP address.
   */
  ipTags?: VirtualMachineScaleSetIpTag[];
  /**
   * The PublicIPPrefix from which to allocate publicIP addresses.
   */
  publicIPPrefix?: SubResource;
}

/**
 * Defines values for IPVersion.
 * Possible values include: 'IPv4', 'IPv6'
 * @readonly
 * @enum {string}
*  @enum_IPv4 IPv4 address
*  @enum_IPv6 IPv6 address
*/
export type IPVersion = string &
  adltypes.OneOf<["IPv4", "IPv6"]>;

/**
 * Describes a virtual machines scale sets network configuration's DNS settings.
 */
export interface VirtualMachineScaleSetPublicIPAddressConfigurationDnsSettings {
  /**
   * The Domain name label.The concatenation of the domain name label and vm index will be the
   * domain name labels of the PublicIPAddress resources that will be created
   */
  domainNameLabel: string;
}

/**
 * Contains the IP tag associated with the public IP address.
 */
export interface VirtualMachineScaleSetIpTag {
  /**
   * IP tag type. Example: FirstPartyUsage.
   */
  ipTagType?: string;
  /**
   * IP tag associated with the public IP. Example: SQL, Storage etc.
   */
  tag?: string;
}

/**
 * Boot Diagnostics is a debugging feature which allows you to view Console Output and Screenshot
 * to diagnose VM status. <br><br> You can easily view the output of your console log. <br><br>
 * Azure also enables you to see a screenshot of the VM from the hypervisor.
 */
export interface BootDiagnostics {
  /**
   * Whether boot diagnostics should be enabled on the Virtual Machine.
   */
  enabled?: boolean;
  /**
   * Uri of the storage account to use for placing the console output and screenshot.
   */
  storageUri?: adltypes.uri;
}

/**
 * Specifies the boot diagnostic settings state. <br><br>Minimum api-version: 2015-06-15.
 */
export interface DiagnosticsProfile {
  /**
   * Boot Diagnostics is a debugging feature which allows you to view Console Output and Screenshot
   * to diagnose VM status. <br><br> You can easily view the output of your console log. <br><br>
   * Azure also enables you to see a screenshot of the VM from the hypervisor.
   */
  bootDiagnostics?: BootDiagnostics;
}
/**
 * Describes a virtual machine scale set extension profile.
 */
export interface VirtualMachineScaleSetExtensionProfile {
  /**
   * The virtual machine scale set child extension resources.
   */
  extensions?: VirtualMachineScaleSetExtension[];
}

/**
 * Describes a Virtual Machine Scale Set Extension.
 */
export interface VirtualMachineScaleSetExtension extends SubResourceReadOnly {
  /**
   * The name of the extension.
   */
  name?: string;
  /**
   * If a value is provided and is different from the previous value, the extension handler will be
   * forced to update even if the extension configuration has not changed.
   */
  forceUpdateTag?: string;
  /**
   * The name of the extension handler publisher.
   */
  publisher?: string;
  /**
   * Specifies the type of the extension; an example is "CustomScriptExtension".
   */
  type?: string;
  /**
   * Specifies the version of the script handler.
   */
  typeHandlerVersion?: string;
  /**
   * Indicates whether the extension should use a newer minor version if one is available at
   * deployment time. Once deployed, however, the extension will not upgrade minor versions unless
   * redeployed, even with this property set to true.
   */
  autoUpgradeMinorVersion?: boolean;
  /**
   * The provisioning state, which only appears in the response.
   * **NOTE: This property will not be serialized. It can only be populated by the server.**
   */
  provisioningState?: string & adltypes.ReadOnly;
  /**
   * Collection of extension names after which this extension needs to be provisioned.
   */
  provisionAfterExtensions?: string[];
}

/**
 * An interface representing SubResourceReadOnly.
 */
export interface SubResourceReadOnly {
  /**
   * Resource Id
   * **NOTE: This property will not be serialized. It can only be populated by the server.**
   */
  id?: armtypes.ArmResourceId & adltypes.ReadOnly;
}

/**
 * Defines values for VirtualMachinePriorityTypes.
 * Possible values include: 'Regular', 'Low'
 * @readonly
 * @enum {string}
 * @enum_Regular Regular priority type
 * @enum_Low Low priority type
 */
export type VirtualMachinePriorityTypes = string &
  adltypes.OneOf<["Regular", "Low"]>;

/**
 * Defines values for VirtualMachineEvictionPolicyTypes.
 * Possible values include: 'Deallocate', 'Delete'
 * @readonly
 * @enum {string}
 * @enum_Deallocate Deallocate on eviction
 * @enum_Delete Delete on eviction
 */
export type VirtualMachineEvictionPolicyTypes = string &
  adltypes.OneOf<["Deallocate", "Delete"]>;


export type Tier = string &
    adltypes.OneOf<["Standard", "Basic"]>;


export interface Sku {
  /**
   * The sku name.
   */
  name?: string;
  /**
   * Specifies the tier of virtual machines in a scale set.<br /><br /> Possible Values:<br /><br
   * /> **Standard**<br /><br /> **Basic**
   */
  tier?: Tier;
  /**
   * Specifies the number of virtual machines in the scale set.
   */
    capacity?: number;
}
