-- Add delete policy for cost estimates
CREATE POLICY "Users can delete their own cost estimates"
ON cost_estimates
FOR DELETE
USING (
  conversation_id IN (
    SELECT id FROM conversations WHERE user_id = auth.uid()
  )
);