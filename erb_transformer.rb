require "timeout"
require "action_view"

delimiter, timeout, *lookup_paths = ARGV
timeout = Float(timeout)

def render(lookup_paths, source)
  lookup_context = ActionView::LookupContext.new(lookup_paths)
  template_handler = ActionView::Template.handler_for_extension("erb")
  template = ActionView::Template.new(source, "inline template", template_handler, format: :text, locals: [])

  ActionView::Base.new(lookup_context).render(template: template)
end

begin
  Timeout.timeout(timeout) do
    source = STDIN.read
    puts "#{delimiter}#{render(lookup_paths, source)}#{delimiter}"
  end
rescue Timeout::Error
  raise "rails-action-view-loader took longer than the specified #{timeout} second timeout"
end
