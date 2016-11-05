Pod::Spec.new do |s|
  s.name     = "Helm"
  s.version  = "2.0.0-rc.2"
  s.authors  = { 'Remi Santos' => 'santos.remi@icloud.com' }
  s.homepage = "www.skippbox.com"
  s.summary  = "Internal gRPC-Helm pod"
  s.source = { :path => '.' }
  s.license  = "New BSD"

  s.ios.deployment_target = "8.0"
  s.osx.deployment_target = "10.9"

  s.dependency '!ProtoCompiler-gRPCPlugin', '1.0.1-pre1'

  # Base directory where the .proto files are.
  src = "protos"

  # Pods directory corresponding to this app's Podfile, relative to the location of this podspec.
  pods_root = 'Pods'

  # Path where Cocoapods downloads protoc and the gRPC plugin.
  protoc_dir = "#{pods_root}/!ProtoCompiler"
  protoc = "#{protoc_dir}/protoc"
  plugin = "#{pods_root}/!ProtoCompiler-gRPCPlugin/grpc_objective_c_plugin"

  # Directory where you want the generated files to be placed. This is an example.
  dir = "#{pods_root}/#{s.name}"

  # Run protoc with the Objective-C and gRPC plugins to generate protocol messages and gRPC clients.
  s.prepare_command = <<-CMD
    mkdir -p #{dir}
    #{protoc} \
        --plugin=protoc-gen-grpc=#{plugin} \
        --objc_out=#{dir} \
        --grpc_out=#{dir} \
        -I #{src} \
        -I #{protoc_dir} \
        #{src}/hapi/**/*.proto
  CMD

  s.subspec "Messages" do |ms|
    ms.source_files = "#{dir}/*.pbobjc.{h,m}", "#{dir}/hapi/**/*.pbobjc.{h,m}"
    ms.header_mappings_dir = dir
    ms.requires_arc = false
    ms.dependency "Protobuf"
    ms.pod_target_xcconfig = {
      'GCC_PREPROCESSOR_DEFINITIONS' => '$(inherited) GPB_USE_PROTOBUF_FRAMEWORK_IMPORTS=1',
    }
  end

  s.subspec "Services" do |ss|
    ss.source_files = "#{dir}/*.pbrpc.{h,m}", "#{dir}/hapi/**/*.pbrpc.{h,m}"
    ss.header_mappings_dir = dir
    ss.requires_arc = true
    ss.dependency 'gRPC-ProtoRPC'
    ss.dependency "#{s.name}/Messages"
  end
end
