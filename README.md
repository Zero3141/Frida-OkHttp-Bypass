## Frida OkHttp 4.9.0 SSL pinning bypass

This script can be used by frida to hijack ssl pinning functions `SSLContext.init()` and `CertificatePinner$Builder.build()`

## Usage

Push your certificate to device
```bash
adb push [PATH_TO_CERT] /data/local/tmp/root.cer
```
Run script
```bash
frida -U -f [TARGET_APP] -l [PATH_TO_THIS_SCRIPT] --no-paus
```
Profit
