import * as adltypes from '@azure-tools/adl.types'
import * as armtypes from '@azure-tools/arm.adl'

interface VirtualMachineProps{
    vmId : string &
           adltypes.ReadOnly;

    hardwareProfile: HWProfile;
    storageProfile: ImageReference;

    dataDisks: DataDisk[] &
               adltypes.MaxItems<128>;

    totalCores?: number;

    v1Prop: adltypes.int64 &
            adltypes.Range<5, 10>;

    v2Prop?: string &
             adltypes.DefaultValue<'defaulted  declartively'>;
}

interface ImageReference{
    publisher:string &
              adltypes.MinLength<2> &
              adltypes.MaxLength<50>;

    offer:string &
          adltypes.DefaultValue<'windows'>;

    sku: string;

    version: string &
             adltypes.MustMatch<'some-arbitrary-regex'>;
}

interface DataDisk {
    diskId: armtypes.ArmResourceId; // note: custom type
}

interface HWProfile {
    virtualMachineSize: string &
                        adltypes.DefaultValue<'ds_v2'>;
}

// we have defined this resource, but we want arm core properties, so we envelop it
export type VirtualMachineNormalized = armtypes.ArmNormalizedResource<VirtualMachineProps>;
