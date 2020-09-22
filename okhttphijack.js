/* 
    Frida OkHttp SSL pinning bypass for version 4.9.0

    - Certificate loaded from /data/local/tmp/root.cer
    - In obfuscated applications, build() can have another name

    Made by https://github.com/Zero3141
    Credits (for SSLContext bypass): https://codeshare.frida.re/@pcipolloni/universal-android-ssl-pinning-bypass-with-frida/
*/
setTimeout(function () {
    Java.perform(function () {

        console.log("");
        console.log("OkHttp 4.9.0 SSL pinning bypass by Zero3141");
        console.log("");

        // Inject custom certificate
        var CertificateFactory = Java.use("java.security.cert.CertificateFactory");
        var FileInputStream = Java.use("java.io.FileInputStream");
        var BufferedInputStream = Java.use("java.io.BufferedInputStream");
        var KeyStore = Java.use("java.security.KeyStore");
        var TrustManagerFactory = Java.use("javax.net.ssl.TrustManagerFactory");
        var SSLContext = Java.use("javax.net.ssl.SSLContext");

        var cf = CertificateFactory.getInstance("X.509");
        try {
            var fileInputStream = FileInputStream.$new("/data/local/tmp/root.cer");
        }
        catch(err) {
            console.log("[-] " + err);
        }
        var bufferedInputStream = BufferedInputStream.$new(fileInputStream);
        var ca = cf.generateCertificate(bufferedInputStream);
        bufferedInputStream.close();
        var keyStoreType = KeyStore.getDefaultType();
        var keyStore = KeyStore.getInstance(keyStoreType);
        keyStore.load(null, null);
        keyStore.setCertificateEntry("ca", ca);
        var tmfAlgorithm = TrustManagerFactory.getDefaultAlgorithm();
        var tmf = TrustManagerFactory.getInstance(tmfAlgorithm);
        tmf.init(keyStore);
        SSLContext.init.overload("[Ljavax.net.ssl.KeyManager;", "[Ljavax.net.ssl.TrustManager;", "java.security.SecureRandom").implementation = function(a,b,c) {
            console.log("[+] SSLContext overloaded")
            SSLContext.init.overload("[Ljavax.net.ssl.KeyManager;", "[Ljavax.net.ssl.TrustManager;", "java.security.SecureRandom").call(this, a, tmf.getTrustManagers(), c);
        };


        // Hijacking CertificatePinner.Builder.build() by returning empty CertificatePinner
        var LinkedHashSet = Java.use("java.util.LinkedHashSet")
        var CertificatePinner = Java.use("okhttp3.CertificatePinner")
        var hashSet = LinkedHashSet.$new();
        var certPinner = CertificatePinner.$new(hashSet, null);
        var Builder = Java.use("okhttp3.CertificatePinner$Builder");
        Builder.build.overload().implementation = function() {
            console.log("[+] CertificatePinner overloaded")
            return certPinner;
        }
 
    });
}, 100);